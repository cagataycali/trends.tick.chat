const mongoose = require('mongoose')
const { getTrends, details } = require('./trends')

var TrendsSchema = new mongoose.Schema({
  country: { type: String, required: true },
  name: {type: String, unique: true, required: true},
  volume: { type: Number, required: true },
  woeid: { type: String, required: true },
  expireAt: { type: Date, default: Date.now }
})

var mongolabUri = process.env.MONGODB_URI
mongoose.connect(mongolabUri, (err) => {
  if (err) console.log(err)
})

TrendsSchema.index({ 'expireAt': 1 }, { expireAfterSeconds: 3600 })

var Trends = mongoose.model('Trends', TrendsSchema)

const addTrend = (country, name, volume, woeid) => {
  return new Promise((resolve, reject) => {
    let newTrend = new Trends({ country, name, volume, woeid })
    newTrend.save((err, doc) => {
      if (err) {
        Trends.findOne({country, name}, (err, trend) => {
          if (err) {
            reject(err['message'])
          } else {
            resolve(trend)
          }
        })
      } else {
        resolve(doc)
      }
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

const gatherTrends = async (lat, lng, callback) => {
  let { countryCode, country, woeid } = await details(lat, lng)
  getTrendsFromDB(country)
    .then(trends => callback(trends))
    .catch(async (err) => {
      let gatheredTrends = []
      let trendsFromTwitter = await getTrends(woeid)
      trendsFromTwitter = trendsFromTwitter.slice(0, 4)
      console.log('Gathered trends from twitter. Inserting into db.')
      for (let trend of trendsFromTwitter) {
        try {
          let newTrend = await addTrend(countryCode, trend.name, trend.tweet_volume, woeid)
          gatheredTrends.push(newTrend)
        } catch (e) {
          console.log('adding trend err', e)
        }
      }
      callback(gatheredTrends)
    })
}

module.exports = gatherTrends
