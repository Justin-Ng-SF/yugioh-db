const { Client } = require('pg')
const config = require('../config.json')

const client = new Client({
  host: config.pgHost, 
  user: config.pgUser, 
  port: config.pgPort, 
  password: config.pgPassword,
  database: config.pgDatabase
})

module.exports = client