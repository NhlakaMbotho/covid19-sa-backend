const jwt = require('jsonwebtoken')
const ExtractJwt = require('passport-jwt').ExtractJwt
const ServiceError = require('../models/service-error')

module.exports = (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    if (!token) throw new ServiceError('Access denied. No token provided.', 'AUTH_ERROR', 401)
    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
      req.user = decoded
      next()
    } catch (error) {
      error.httpStatus = 401
      error.code = 'AUTH_ERROR'
      throw new ServiceError(error)
    }
  } else {
    next()
  }
}
