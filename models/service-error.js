module.exports = class ServiceError extends Error {
  constructor (
    message = 'Internal Server Error',
    errorCode = 'SERVER_ERROR',
    httpStatus = 500,
    errorName = 'ServiceError',
    stack = undefined,
    extraData = undefined) {
    if (arguments.length === 1 && message instanceof Error) {
      super(message.message)
      this.name = message.name || errorName
      this.code = message.code ? message.code + '' : errorCode
      this.status = message.httpStatus || httpStatus
      this.stack = message.stack
      this.extraData = message.extraData
    } else {
      super(message)
      this.code = errorCode
      this.name = errorName
      this.status = httpStatus
      this.stack = stack
      this.extraData = extraData
    }
  }
}
