// static imports
import { json, urlencoded } from 'body-parser'
import errorhandler from 'errorhandler'
import compression from 'compression'
import lusca from 'lusca'
import http, { Server } from 'http'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
import express, { NextFunction } from 'express'
import _ from 'lodash'
import codes from './common/response'
import { consortium, mongo } from './common/messages'
import { variables, environments } from './common/config'
import logger from './utils/logger'
import routes from './routes'
import {
  getEnvironmentVariable, getConnectionString
} from './utils/platform'
import { RedisHandler } from './utils/redis'

let server: Server


// api server port
const port = getEnvironmentVariable(variables.PORT.name)

// create a new express application instance
const app: express.Application = express()

// initilise express server
if (_.eq(getEnvironmentVariable(variables.NODE_ENV.name), environments.production)) {
  server = https.createServer({
    key: fs.readFileSync(getEnvironmentVariable(variables.SERVER_PRIVATE_KEY.name)),
    cert: fs.readFileSync(getEnvironmentVariable(variables.SERVER_FULLCHAIN_KEY.name))
  }, app)
} else {
  server = http.createServer(app)
}

// Disable X-Frame
app.disable('x-powered-by')

// set content type json
app.use((request: express.Request, response: express.Response, next: NextFunction) => {
  try {
    decodeURIComponent(request.path)
  } catch (e) {
    response.status(codes.success).json({ message: consortium.welcome })
  }
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  next()
})

// To allow any unauthorised self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Set template for node
app.set('view engine', 'ejs')

// cross-origin configuration
app.use(cors({
  origin: '*'
}))

// compress requests
app.use(compression())

// error handler
app.use(errorhandler())

// security middleware
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// parse requests of content-type - application/json
app.use(json({ limit: '1gb', strict: true }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ limit: '1gb', extended: true }))

// json spaces set
app.set('json spaces', 2)

// inject all routes here
routes(app)

// parse requests of content-type - application/json
app.use(json({ limit: '1gb', strict: true }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ limit: '1gb', extended: true }))

// base route of application
app.use('/', (request: express.Request, response: express.Response) => response.status(codes.success).json({ message: consortium.welcome }))

// redirect to default route
app.use('*', (request: express.Request, response: express.Response) => response.status(codes.success).json({ message: consortium.welcome }))

// mongo db connection initialize
mongoose.connect(getConnectionString(), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(
  () => {
    logger.info(mongo.success(
      getEnvironmentVariable(variables.DB_URL.name),
      getEnvironmentVariable(variables.DB_NAME.name),
      getEnvironmentVariable(variables.DB_PORT.name),
    ))
    // listen for requests
    server.listen(port, () => {
      // initialise redis layer
      RedisHandler.getInstance()
      logger.info(consortium.initialised(port))
    })
  },
).catch((error) => {
  logger.error(mongo.error(error))
  logger.info(getConnectionString())
  process.exit()
})
