const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

module.exports = {
  RegionalStat: mongoose.model('RegionalStatistic', new mongoose.Schema({
    region: String,
    confirmedCases: Number,
    testCases: Number,
    deaths: Number
  })),

  CountryStat: mongoose.model('Statistic', new mongoose.Schema({
    deaths: Number,
    unknownCases: Number,
    date: Date,
    country: String,
    regions: [
      { type: mongoose.Schema.ObjectId, ref: 'RegionalStatistic' }
    ]
  }))
}
