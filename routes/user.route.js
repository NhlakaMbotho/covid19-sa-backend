const bcrypt = require('bcrypt')
const { User, validate } = require('../database/models/user.model')
const express = require('express')
const router = express.Router()
const ServiceError = require('../models/service-error')

router.post('/sign-up', async (req, res, next) => {
  try {
    const { error } = validate(req.body)
    if (error) {
      throw new ServiceError(
        error.details[0].message,
        error.code || 'AUTH_ERROR',
        422,
        error.name,
        error.stack
      )
    }

    // find an existing user
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      throw new ServiceError(
        'User already registered',
        'AUTH_ERROR',
        401,
        undefined
      )
    }

    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      telNo: req.body.telNo
    })

    try {
      user.password = await bcrypt.hash(user.password, 10)
    } catch (error) {
      throw new ServiceError(
        error.message,
        error.code || 'AUTH_ERROR',
        401,
        undefined,
        error.stack
      )
    }
    user
      .save()
      .then(user => {
        const token = user.generateAuthToken()
        res
          .header('x-auth-token', token)
          .send({
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            telNo: user.telNo,
            country: user.country,
            token
          })
          .status(201)
      })
      .catch(err => {
        throw new ServiceError(
          err.message,
          err.code || 'AUTH_ERROR',
          401,
          undefined,
          err.stack
        )
      })
  } catch (err) {
    next(err)
  }
})

router.post('/sign-in', async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    )
    const token = await user.generateAuthToken()

    res
      .header('x-auth-token', token)
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        telNo: user.telNo,
        token
      })
      .status(201)
  } catch (err) {
    next(
      new ServiceError(
        err.message,
        err.code || 'AUTH_ERROR',
        401,
        undefined,
        err.stack
      )
    )
  }
})

module.exports = router
