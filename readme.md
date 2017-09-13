# Tick.Chat Trends Service

Tick.chat depends on Twitter trends, this repository for this service.

# Usage

This service is easy to use, just do get request.

_GET_, <https://yourownapp.com/lat/lng/country>

_Example_, <https://trends.tick.chat/39/32/TR>

# Result

```json
{
  "trends": [
    {
      "country": "TR",
      "name": "Beşiktaş",
      "volume": 240927,
      "woeid": "23424969",
      "id": "59b9a29592f9f90012499c0e",
      "expireAt": "2017-09-13T21:26:45.513Z",
      "messages": []
    },
    {
      "country": "TR",
      "name": "#KerkükAnkaradır",
      "volume": 18587,
      "woeid": "23424969",
      "id": "59b9a29592f9f90012499c0f",
      "expireAt": "2017-09-13T21:26:45.555Z",
      "messages": []
    },
    {
      "country": "TR",
      "name": "#Sevdiğininİhaneti",
      "volume": 15884,
      "woeid": "23424969",
      "id": "59b9a29592f9f90012499c10",
      "expireAt": "2017-09-13T21:26:45.568Z",
      "messages": []
    }
  ]
}
```

# Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cagataycali/trends.tick.chat)
