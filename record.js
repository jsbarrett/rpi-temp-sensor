require('dotenv').config()
const fs = require('fs')
const getTemperature = require('./dht11.js')
const FREQUENCY = 5 * 60 * 1000 // seconds between each recording
const db = require('./sql_connection')

function record () {
  getTemperature('4')
    .then(data => {
      const sql = `
        INSERT INTO temperature_and_humidity
          (timestamp, temperature, humidity)
        VALUES
          (?,?,?)
      `
      const values = data.split(',')
      db.query(sql, values)
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

