const auth = require('../middleware/auth.midleware')
const express = require('express')
const router = express.Router()
const Statistic = require('../database/models/statistic.model')
const ServiceError = require('../models/service-error')

router.post('/create', auth, async (req, res, next) => {
  try {
    const stat = new Statistic(req.body)
    const result = await stat.save()
    res.send(result)
  } catch (error) {
    if (error.code === 11000) {
      //Need to make the date property of the Statistic object unique 
      return next(new ServiceError('Stat already exists', error.code + '', 409))
    }
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.post('/update', auth, async (req, res, next) => {
  try {
    const stat = new Statistic(req.body)
    await stat.updateOne(stat)
    const stats = await Statistic.find({ _id: stat.id })
    res.send(stats)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.get('/list/:id', auth, async (req, res, next) => {
  try {
    const stats = await Statistic.find({ id: req.params.id })
    res.send(stats)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 400))
  }
})

module.exports = router
