require('dotenv').config()
const fs = require('fs')
const getTemperature = require('./dht11.js')
const FREQUENCY = 5 * 60 * 1000 // seconds between each recording
const axios = require('axios')
const sensorId = process.env.SENSOR_ID

function record () {
  getTemperature('4')
    .then(data => {
      const values = data
        .split(',')
        .map(x => x.trim())
      console.log(values)
      axios.post('http://localhost:3000/api', {
        date: values[0],
        temperature: values[1],
        humidity: values[2],
        sensorId
      })
        .then(response => {
          setTimeout(() => record(), FREQUENCY)
        })
        .catch(err => {
          console.log(err)
          setTimeout(() => record(), FREQUENCY)
        })
    })
    .catch(err => {
      console.log(err)
      setTimeout(() => record(), FREQUENCY)
    })
}

record()

