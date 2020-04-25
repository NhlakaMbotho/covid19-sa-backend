const mongoose = require('mongoose')
const UserModels = require('./user.model')
const Types = mongoose.Schema.Types

module.exports = {
  CountryStat: mongoose.model('CountryStat', new mongoose.Schema({
    deaths: Number,
    unknownCases: Number,
    confirmedCases: Number,
    testCases: Number,
    date: Date,
    country: String,
    regions: [
      {
        region: String,
        confirmedCases: Number,
        testCases: Number,
        deaths: Number
      }
    ]
  })),

  ...UserModels
}
