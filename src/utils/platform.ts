import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import parse from 'parse-bearer-token'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import ms from 'ms'
import uniqid from 'uniqid'
import { NextFunction, Request, Response } from 'express'
import cryptr from 'cryptr'
import atob from 'atob'
import { variables } from '../common/config'
import codes from '../common/response'
import { errors } from '../common/messages'
import { HttpResponse } from '../app/models/response'
import { User } from '../app/models/user'

// get environment variable from .env file or return default
export const getEnvironmentVariable = (variable: number | string) => (process.env[variable] ? process.env[variable] : _.get(variables, `${variable}.value`))

export const getServerAPIRevision = () => (_.isEmpty(getEnvironmentVariable(variables.SERVER_API_REVISION.name)) ? '' : `${getEnvironmentVariable(variables.SERVER_API_REVISION.name)}/`)

// get db connection string
export const getConnectionString = () => (!(!getEnvironmentVariable(variables.DB_USERNAME.name))
  && !_.isEmpty(getEnvironmentVariable(variables.DB_USERNAME.name))
  && getEnvironmentVariable(variables.DB_PASSWORD.name)
  && !_.isEmpty(getEnvironmentVariable(variables.DB_PASSWORD.name))
  ? `mongodb://${getEnvironmentVariable(variables.DB_USERNAME.name)}:${encodeURIComponent(getEnvironmentVariable(variables.DB_PASSWORD.name))}@${getEnvironmentVariable(variables.DB_URL.name)}:${getEnvironmentVariable(variables.DB_PORT.name)}/${getEnvironmentVariable(variables.DB_NAME.name)}${!_.isEmpty(getEnvironmentVariable(variables.DB_REPLICA_SET.name)) ? `?replicaSet=${getEnvironmentVariable(variables.DB_REPLICA_SET.name)}` : ''}`
  : `mongodb://${getEnvironmentVariable(variables.DB_URL.name)}:${getEnvironmentVariable(variables.DB_PORT.name)}/${getEnvironmentVariable(variables.DB_NAME.name)}${!_.isEmpty(getEnvironmentVariable(variables.DB_REPLICA_SET.name)) ? `?replicaSet=${getEnvironmentVariable(variables.DB_REPLICA_SET.name)}` : ''}`)

// extract parameter from url by name
export const extractParameterFromURL = (name: string, url: string) => {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// get error response for request
export const getErrorResponse = (value: string, data?: any): HttpResponse => {
  const error: HttpResponse = _.get(errors, `${value}`)
  if (error) {
    if (!_.isNil(data)) {
      return { message: error.message, code: error.code, data } as HttpResponse
    }
    return { message: error.message, code: error.code } as HttpResponse
  }
  return { message: 'N/A', code: 'N/A' } as HttpResponse
}

// get success response for request
export const getSuccessResponse = (value: string, data: any = {}): HttpResponse => {
  const error: HttpResponse = _.get(errors, `${value}`)
  if (error) {
    return { message: error.message, code: error.code, data } as HttpResponse
  }
  return { message: 'N/A', code: 'N/A', data: {} } as HttpResponse
}

// get error log
export const getErrorLog = (method: string, payload: any = {}, message: string = 'an error occurred'): string => `method: ${method}, payload: ${JSON.stringify(payload)}, error: ${message}`

// get days in month
export const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate()

// check user token is valid or not
export const isUserAuthenticated = (audience: string | string[]) => (request: Request, response: Response, next: NextFunction) => {
  const jwtToken = parse(request as any)
  if (!jwtToken) {
    return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT004.code))
  }
  jwt.verify(jwtToken, getEnvironmentVariable(variables.JWT_PRIVATE_SECRET.name), { audience, issuer: getEnvironmentVariable(variables.JWT_ISSUER.name) }, (error: VerifyErrors, user: object) => {
    if (!_.isNil(error)) {
      if (error.name === 'JsonWebTokenError') {
        return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT001.code))
      } if (error.name === 'NotBeforeError') {
        return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT002.code))
      } if (error.name === 'TokenExpiredError') {
        return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT003.code))
      }
      return response.status(codes.unauthorized).json(getErrorResponse(errors.COM001.code))
    }

    // request.user = user as User
    return next()
  })
}

// check content type is valid or not
export const isContentTypeValid = (contents: [string]) => (request: Request, response: Response, next: NextFunction) => {
  if (!_.includes(contents, request.headers['content-type'])) {
    return response.status(codes.bad_request).json({ message: `${errors.COM004.message}${contents.join(', ')}`, code: 'COM004' })
  }
  return next()
}

// encrypt password using cryptr
export const encryptPassword = (value: string) => new cryptr(getEnvironmentVariable(variables.PASSWORD_HASH.name)).encrypt(value)

// decrypt password using cryptr
export const decryptPassword = (value: string) => new cryptr(getEnvironmentVariable(variables.PASSWORD_HASH.name)).decrypt(value)

// positive number check
export const isNumberPositive = (value: string) => /^[+]?\d*\.?\d+$/.test(value)

// valid month check
export const isValidMonth = (value: number) => /^([1-9]|1[012])$/.test(String(value))

// valid year check
export const isValidYear = (value: number) => /^19[5-9]\d|20[0-4]\d|2050$/.test(String(value))

// valid url check
export const isValidURl = (value: string) => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(value)

// valid phone check
export const isValidPhone = (value: number | string) => /^\d{10}$/.test(String(value))

// valid number check
export const isValidNumber = (value: string | number) => /^[0-9]*$/.test(String(value))

// valid decimal number check
export const isValidDecimalNumber = (value: string | number) => /^-?\d*(\.\d+)?$/.test(String(value))

// valid object check
export const isObjectValid = (query: any): boolean => {
  try {
    JSON.parse(JSON.stringify(query))
    return true
  } catch (e) {
    return false
  }
}


// generate unique uid
export const generateUID = (): string => uuidv4()

// generate short unique uid
export const generateShortUID = (): string => uniqid.time()

// get milliseconds from string
export const getMilliseconds = (time: string) => {
  if (typeof time === 'string') {
    const milliseconds = ms(time)
    if (typeof milliseconds === 'undefined') {
      return
    }
    return milliseconds
  }
}

// get seconds from string
export const getSeconds = (time: string) => {
  if (typeof time === 'string') {
    const milliseconds = ms(time)
    if (typeof milliseconds === 'undefined') {
      return
    }
    return milliseconds / 1000
  }
}

// get token expiration timestamp
export const getExpirationTimestamp = (token: string) => {
  try {
    const jwtTokenObject = JSON.parse(atob(token.split('.')[1]))
    return jwtTokenObject.exp
  } catch (error) {
    return 0
  }
}
