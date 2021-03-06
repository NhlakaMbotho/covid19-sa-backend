
global.rootPath = __dirname

if (!process.env.PRIVATE_KEY) {
  console.error('FATAL ERROR: PRIVATE_KEY is not defined.')
  process.exit(1)
}

/**
 * Route Imports
 */
const routes = require('./routes')
/**
 * Middleware
 */
const corsMiddleware = require('./middleware/cors.middleware')
const errorMiddleware = require('./middleware/error.middleware')

/**
 * Documentation
 */
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerOptions = require('./config/swagger.json')

const express = require('express')
const app = express()

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
app.use('/api/statistics', routes.statistics)
app.use('/api/users', routes.users)
app.use('/', swaggerUi.serve, swaggerUi.setup(YAML.load('./documentation/openapi.yml')))

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
