const Twit = require('twit')

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
})

const details = (lat, lng) => {
  return new Promise((resolve, reject) => {
    T.get('trends/closest', { lat, 'long': lng }, function (err, closestData) {
      if (!err) {
        let {parentid, countryCode} = closestData[0]
        resolve({woeid: parentid, countryCode})
      } else {
        reject(err)
      }
    })
  })
}

// ID IS WOEID!
const getTrends = (id) => {
  return new Promise((resolve, reject) => {
    T.get('trends/place', { id }, (err, data) => {
      if (!err) {
        let trends = data[0].trends.filter(trend => {
          if (trend.tweet_volume !== null && trend.promoted_content === null) {
            return trend
          }
        })
        resolve(trends)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  getTrends, // Get trends from woeid
  details // Get details for location from ip.
}
