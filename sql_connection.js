const mysql = require('mysql')

class Connection {
  constructor () {
    this.connection = mysql.createPool({
      connectionLimit: 25,
      connectTimeout: 30000,
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
    })
  }
  query (sql, values) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, values, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  }
}

const connection = new Connection()
module.exports = connection

