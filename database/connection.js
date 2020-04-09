const mongoose = require('mongoose')
if (!process.env.APP_ENV) process.env.APP_ENV = 'development'

const connectionString = process.env.APP_ENV === 'production'
  ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-aaznq.mongodb.net/test?retryWrites=true&w=majority`
  : 'mongodb://localhost:27017/users'

module.exports = {
  connect () {
    mongoose
      .connect(connectionString, { useNewUrlParser: true })
      .then(() => console.log('Connected to MongoDB...'))
      .catch((error) => console.error('Could not connect to MongoDB...' + error))
  }
}
