const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

module.exports = mongoose.model('Statistic', new mongoose.Schema({
  confirmedCases: Number,
  testCases: Number,
  dailyTestCases: Number,
  deaths: Number,
  unknownCases: Number,
  date: Date,
  country: String,
  region: String
}))
