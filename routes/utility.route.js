const auth = require('../middleware/auth.midleware')
const express = require('express')
const router = express.Router()
const VehicleItem = require('../database/models/vehicle-items.model')
const ServiceError = require('../models/service-error')

router.get('/vehicle-items', auth, async (req, res, next) => {
  VehicleItem.find({})
    .select(['-_id', '-__v'])
    .then(items => {
      res.send(items)
    })
    .catch(error => {
      error.httpStatus = 400
      next(new ServiceError(error))
    })
})

router.post('/vehicle-items', async (req, res, next) => {
  try {
    const insert = await VehicleItem.insertMany(req.body)
    res.status(201).send(insert)
  } catch (error) {
    if (error.code === 11000) {
      error.httpStatus = 400
      next(new ServiceError(`item '${error.op.name}' already exists`))
    } else {
      next(new ServiceError(error))
    }
  }
})

module.exports = router
