const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

module.exports = mongoose.model('Tow', new mongoose.Schema({
  insuranceRef: {
    unique: true,
    type: String,
    minlength: 6,
    maxlength: 255
  },
  signature: String,
  towVehicleRegNo: String,
  destinationLocation: String,
  date: Date,
  driverId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  // Could make it its own model but its not necesary for now
  owner: {
    name: String,
    telNo: String,
    insuranceCompany: String,
    signature: String
  },
  vehicle: {
    make: String,
    model: String,
    colour: String,
    regNo: String,
    odaMeter: String,
    causeOfBreakDown: String,
    transmission: String,
    locationOfBreakDown: String,
    items: Array,
    images: Array
  }
}))
