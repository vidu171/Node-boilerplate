import { application } from './config'
// Logging
export const logging = {
  initialised: (level: string) => `Logging initialized at ${level} level`
}

// Application
export const consortium = {
  initialised: (port: string | number) => `${application.name} API server listening on port => ${port}`,
  welcome: `${application.name} Mainframe API`
}

// MongoDB
export const mongo = {
  error: (error: object | string) => `MongoDB connection error. ${error}`,
  success: (dbURL: string, dbName: string, port: number | string) => `MongoDB connected succesfully. Host: ${dbURL} Database: ${dbName} Port: ${port}`
}

// Redis Caching
export const caching = {
  error: (error: object | string) => `Redis connection error. ${error}`,
  success: (URL: string, port: number | string) => `Redis Server connected succesfully. Host: ${URL} Port: ${port}`
}

export const errors = {
  // Common
  COM001: { message: 'server error occured', code: 'COM001' },
  COM002: { message: 'operation forbidden', code: 'COM002' },
  COM003: { message: 'authentication failure', code: 'COM003' },
  COM004: { message: 'invalid content-type, accepted content types: ', code: 'COM004' },

  // Mongo Common Errors
  MON001: { message: 'object id cannot be blank', code: 'MON001' },
  MON002: { message: 'query object is invalid', code: 'MON002' },
  MON003: { message: 'update object is invalid', code: 'MON003' },
  MON004: { message: 'sort object is invalid', code: 'MON004' },

  // JWT
  JWT001: { message: 'jwt verification failed', code: 'JWT001' },
  JWT002: { message: 'jwt not active yet', code: 'JWT002' },
  JWT003: { message: 'jwt token expired', code: 'JWT003' },
  JWT004: { message: 'jwt token missing', code: 'JWT004' },

}
