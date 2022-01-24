const {Pool} = require('pg')

const db = new Pool({
  user: 'postgres',
  database: 'yelp',
  password: 'Icebreaker@1964',
  port: 5432,
  host: 'localhost',
})

module.exports = { db };
