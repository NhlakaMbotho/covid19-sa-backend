
global.rootPath = __dirname

// Routes
const usersRoute = require('./routes/user.route')
const towingRoute = require('./routes/towing.route')
const utilityRoute = require('./routes/utility.route')

// Middleware
const corsMiddleware = require('./middleware/cors.middleware')
const errorMiddleware = require('./middleware/error.middleware')


const express = require('express')
const app = express()

const prindPdf = require('./lib/pfgGenerator')
const emailer = require('./lib/emailer')

process.env.PRIVATE_KEY = 'devPrivateKey'
if (!process.env.PRIVATE_KEY) {
  //  process.env.PRIVATE_KEY = 'devPrivateKey'
  console.error('FATAL ERROR: privateKey is not defined.')
  process.exit(1)
}

// connect to mongodb
require('./database/connection').connect()
app.use(express.json({ limit: '50mb' }))
app.use(corsMiddleware)
// use users route for api/users
// app.use('/api/users', usersRoute)
// app.use('/api/towings', towingRoute)
// app.use('/api/utils', utilityRoute)

// !this needs to be placed after all app.use attechments
app.use(errorMiddleware)

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log(`Listening on port ${port}...`)
})
