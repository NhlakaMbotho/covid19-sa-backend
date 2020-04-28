const auth = require('../middleware/auth.midleware')
const express = require('express')
const router = express.Router()
const { CountryStat } = require('../database/models')
const ServiceError = require('../models/service-error')

router.get('/', auth, async (req, res, next) => {
  try {
    const stats = await CountryStat.find()
    res.send(stats)
  } catch(error) {
    next(new ServiceError(error.message, error.code.toString(), 400))
  }
})

router.post('/create', auth, async (req, res, next) => {
  try {
    const stat = new CountryStat(req.body)
    const result = await stat.save()
    res.send(result)
  } catch (error) {
    if (error.code === 11000) {
      //TODO: Need to make the date property of the Statistic object unique
      return next(new ServiceError('Stat already exists', error.code + '', 409))
    }
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.put('/update', auth, async (req, res, next) => {
  try {
    const stat = new CountryStat(req.body)
    await stat.updateOne(stat)
    const stats = await CountryStat.findById(stat.id )
    res.send(stats)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.get('/list/:id', auth, async (req, res, next) => {
  try {
    const stats = await CountryStat.findById(req.params.id)
    res.send(stats)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 400))
  }
})

module.exports = router
