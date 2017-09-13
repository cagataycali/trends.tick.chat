const mongoose = require('mongoose')
const { getTrends, details } = require('./trends')

var TrendsSchema = new mongoose.Schema({
  country: { type: String, required: true },
  name: {type: String, unique: true, required: true},
  volume: { type: Number, required: true },
  woeid: { type: String, required: true },
  expireAt: { type: Date, default: Date.now }
})

var mongolabUri = process.env.MONGODB_URI || 'mongodb://heroku_p9b5x3pg:ce7pnqr9udjcaq9pi1p0fgk6mm@ds161873.mlab.com:61873/heroku_p9b5x3pg'
mongoose.connect(mongolabUri, err => console.log(err ? err : 'Mongo connected.'))

TrendsSchema.index({ 'expireAt': 1 }, { expireAfterSeconds: 3600 })

var Trends = mongoose.model('Trends', TrendsSchema)

const addTrend = (country, name, volume, woeid) => {
  return new Promise((resolve, reject) => {
    let newTrend = new Trends({ country, name, volume, woeid })
    newTrend.save((err, doc) => {
      err ? reject(err['message']) : resolve(doc)
    })
  })
}

const getTrendsFromDB = (country) => {
  return new Promise((resolve, reject) => {
    Trends.find({country}, (err, trends) => {
      if (err) {
        reject(err.message)
      } else {
        trends.length === 0 ? reject(`Trends isn't exist.`) : resolve(trends)
      }
    })
  })
}

const gatherTrends = (country, lat, lng, callback) => {
  getTrendsFromDB(country)
    .then(trends => callback(trends))
    .catch(async (err) => {
      // Get woeid and countryCode for fetching data from twitter.
      let { countryCode, woeid } = await details(lat, lng)
      // If cloudflare's ip-country equality isn't fit for twitter countryCode. (It should not!)
      if (countryCode !== country) {
        console.log('ERROR! countryCode isn\'t equal current cloudflare country.')
      }
      // Get 'country' trends from twitter.
      let gatheredTrends = []
      let trendsFromTwitter = await getTrends(woeid)
      trendsFromTwitter = trendsFromTwitter.slice(0, 3)
      console.log('Gathered trends from twitter. Inserting into db.')
      for (let trend of trendsFromTwitter) {
        let newTrend = await addTrend(country, trend.name, trend.tweet_volume, woeid)
        gatheredTrends.push(newTrend)
      }
      callback(gatheredTrends)
    })
}

module.exports = gatherTrends