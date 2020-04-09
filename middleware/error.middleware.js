const ServiceError = require('../models/service-error')

module.exports = function (err, req, res, next) {
  let _error = null
  let httpStatus = 500

  if (err instanceof ServiceError) {
    _error = {
      message: err.message,
      extraData: err.extraData,
      name: err.name,
      code: err.code,
      stackTrace: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    }

    httpStatus = err.status || 500
  } else {
    _error = {
      message: err.message || 'Internal Server Error',
      name: err.constructor.name || 'Error',
      stackTrace: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    }
  }

  console.error(err)

  res.status(httpStatus).send(_error)
}
