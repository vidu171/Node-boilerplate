
import dotenv from 'dotenv'
import winston, { format } from 'winston'
import winstonTimestampColorize from 'winston-timestamp-colorize'
import {
  log, environments, variables
} from '../common/config'
import { logging } from '../common/messages'
import { getEnvironmentVariable } from './platform'
// inject environment variables file
dotenv.config()

winston.format.colorize().addColors(log.colors)

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: getEnvironmentVariable(variables.NODE_ENV.name) === environments.production ? log.levels.error.value : log.levels.debug.value,
      format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.simple(),
        winstonTimestampColorize({ color: 'green' }),
        format.printf((msg) => `${msg.level}: ${msg.message} - ${msg.timestamp}`)
      ),
    }),
    new winston.transports.File({
      filename: log.filename,
      level: log.levels.debug.value,
      format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf((msg) => `${msg.level}: ${msg.message} - ${msg.timestamp}`)
      ),
    })
  ]
}

const logger = winston.createLogger(options)

if (getEnvironmentVariable(variables.NODE_ENV.name) !== environments.production) {
  logger.info(logging.initialised(getEnvironmentVariable(variables.LOG_LEVEL.name)))
}

export default logger
