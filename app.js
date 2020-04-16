
global.rootPath = __dirname

/**
 * Route Imports
 */
const usersRoute = require('./routes/user.route')
const statisticsRoute = require('./routes/statistics.route')

/**
 * Middleware
 */
const corsMiddleware = require('./middleware/cors.middleware')
const errorMiddleware = require('./middleware/error.middleware')

const express = require('express')
const app = express()

if (!process.env.PRIVATE_KEY) {
  console.error('FATAL ERROR: PRIVATE_KEY is not defined.')
  process.exit(1)
}

/**
 * Database Connection
 */
require('./database/connection').connect()

/**
 * Setup
 */
app.use(express.json({ limit: '50mb' }))
app.use(corsMiddleware)

/**
 * Route mappings
 */
app.use('/api/statistics', statisticsRoute)
app.use('/', usersRoute)

/**
 * Error handling middleware
 * 
 * !! this needs to be placed after all app.use mappings !!
 */
app.use(errorMiddleware)

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log(`Listening on port ${port}...`)
})
