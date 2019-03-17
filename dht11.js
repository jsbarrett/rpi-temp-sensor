const path = require('path')
const spawn = require('child_process').spawn
const pythonScriptPath = path.resolve(__dirname, './Adafruit_Pythong_DHT/examples/AdafruitDHT.py')
const SENSOR = '11' // DHT11 module
// const PIN = '4' // GPIO pin on pi
// const FREQUENCY = 5 // seconds between each reading

function getTemperature (pinOnPi) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [pythonScriptPath, SENSOR, pinOnPi])
    const killTimeout = setTimeout(() => {
      pythonProcess.kill()
      reject()
    }, 5 * 30 * 1000)

    pythonProcess.stdout.on('data', buffer => {
      clearTimeout(killTimeout)
      const data = buffer.toString().split(' ')
      const temperature = Number(data[0]) // * 9 / 5 + 32
      const humidity = Number(data[1])

      console.log(`${new Date().toISOString()}, ${temperature}, ${humidity}`)
      resolve(`${new Date().toISOString()}, ${temperature}, ${humidity}`)
    })

    pythonProcess.on('error', err => {
      clearTimeout(killTimeout)
      console.log(err)
      reject(err)
    })
  })
}

module.exports = getTemperature

