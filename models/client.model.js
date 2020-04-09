module.exports = class Client {
  constructor (dbResponse, token) {
    this.id = dbResponse._doc._id
    this.telNo = dbResponse._doc.telNo
    this.email = dbResponse._doc.email
    this.address = dbResponse._doc.address
    this.token = token
  }
}
