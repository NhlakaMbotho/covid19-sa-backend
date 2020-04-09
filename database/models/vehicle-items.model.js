const mongoose = require('mongoose')

module.exports = mongoose.model('VehicleItem', new mongoose.Schema({
  isSelected: Boolean,
  name: {
    unique: true,
    type: String,
    minlength: 1,
    maxlength: 255
  }
}))
