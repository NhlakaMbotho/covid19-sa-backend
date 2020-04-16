const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

module.exports = {
  Statistic: mongoose.model('Statistic', new mongoose.Schema({
    confirmedCases: Number,
    testCases: Number,
    dailyTestCases: Number,
    deaths: Number,
    unknownCases: Number,
    date: Date,
    country: String,
    region: String
  })),

  StatisticSnapshot: mongoose.model('StatisticSnapshot', new mongoose.Schema({
    confirmedCases: Number,
    testCases: Number,
    dailyTestCases: Number,
    deaths: Number,
    unknownCases: Number,
    date: Date,
    country: String,
    region: String
  }))
}
