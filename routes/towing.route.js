const auth = require('../middleware/auth.midleware')
const express = require('express')
const router = express.Router()
const Tow = require('../database/models/tow.model')
const ServiceError = require('../models/service-error')
const Emailer = require('../lib/emailer')
const InvoiceManager = require('../lib/invoice')

router.post('/create', auth, async (req, res, next) => {
  try {
    const tow = new Tow(req.body)
    await tow.save()
    const towings = await Tow.find({ driverId: req.body.driverId })
    res.send(towings)
  } catch (error) {
    if (error.code === 11000) {
      return next(new ServiceError('Cannot use an existing Insurance Ref Number', error.code + '', 409))
    }
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.post('/update', auth, async (req, res, next) => {
  try {
    const tow = new Tow(req.body)
    await tow.updateOne(tow)
    const towings = await Tow.find({ _id: tow.id })
    res.send(towings)
  } catch (error) {
    if (error.code === 11000) {
      return next(new ServiceError('Cannot use an existing Insurance Ref Number', error.code + '', 409))
    }
    next(new ServiceError(error.message, error.code + '', 422))
  }
})

router.get('/list/:id', auth, async (req, res, next) => {
  try {
    const tows = await Tow.find({ driverId: req.params.id })
    res.send(tows)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 400))
  }
})

router.post('/email', auth, async (req, res, next) => {
  try {
    const tow = await Tow.find({ _id: req.params.id })
    const path = await InvoiceManager.createInvoice(tow)

    await Emailer.sendMail(req.body.email, path)

    res.sendStatus(200)
  } catch (error) {
    next(new ServiceError(error.message, error.code + '', 400))
  }
})

module.exports = router
