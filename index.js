const express = require('express')
const app = express()
const getTrends = require('./db')
const cache = require('apicache').middleware

app.use(cache('1 hour'))

app.get('/:lat/:lng/:country', (req, res) => {
  let {lat, lng, country} = req.params
  res.header('Access-Control-Allow-Origin', '*')
  getTrends(country, lat, lng, (trends) => {
    let _trends = trends.map(trend => {
      return {
        id: trend._id,
        name: trend.name,
        country: trend.country,
        volume: trend.volume,
        expireAt: trend.expireAt,
        messages: []
      }
    })
    res.json(_trends)
  })
})

app.listen(process.env.PORT || 5000)
