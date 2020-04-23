const bcrypt = require('bcrypt')
const { User, validate } = require('../database/models/user.model')
const Client = require('../models/client.model')
const express = require('express')
const router = express.Router()
const ServiceError = require('../models/service-error')

/**
 * @swagger
 *
 * /api/users/register:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description:
 *         in: formData
 *         required: true
 *         type: string
 *       - name: telNo
 *         description:
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description:
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description:
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post('/register', async (req, res, next) => {
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

    /**
     * This is redundant, the same behavior can be achieved by making the email property unique
     */
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      throw new ServiceError(
        'User already registered',
        'AUTH_ERROR',
        401,
        undefined
      )
    }

    user = new User(req.body)

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
          .send(new Client(user, token))
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

/**
 * @swagger
 *
 * /api/users/login:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email address
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    )
    const token = await user.generateAuthToken()

    res
      .header('x-auth-token', token)
      .send(new Client(user, token))
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
