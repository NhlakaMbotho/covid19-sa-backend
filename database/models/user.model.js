const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  telNo: {
    type: String,
    minlength: 10,
    maxlength: 20,
    required: true
  },
  address: {
    street: String,
    city: String,
    region: String,
    postalCode: String,
    country: String
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },

  // give different access rights if admin or not
  isAdmin: Boolean
})

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.PRIVATE_KEY, {
    expiresIn: '1hrs'
  })
  return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) { throw new Error('Email not recognized') }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!(isMatch)) { throw new Error('Incorrect username or password') }

  return user
}

const User = mongoose.model('User', UserSchema)

function validateUser (user) {
  return Joi.validate(user, {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    telNo: Joi.string().min(10).max(255).required(),
    password: Joi.string().min(3).max(255).required(),
    address: Joi.object()
  })
}

exports.User = User
exports.validate = validateUser
