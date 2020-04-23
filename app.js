
global.rootPath = __dirname

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
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerOptions = require('./config/swagger.json')

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
app.use('/api/statistics', routes.statistics)
app.use('/api/users', routes.users)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions), { customCss: '.swagger-ui .topbar { display: none }' }));

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
