/* eslint-disable class-methods-use-this */
/* eslint-disable space-before-function-paren */
import redis, { RedisClient } from 'redis'
import _ from 'lodash'
import { getEnvironmentVariable } from './platform'
import { variables } from '../common/config'
import logger from './logger'
import { caching } from '../common/messages'

export class RedisHandler {
    private static instance: RedisHandler

    private static _redis: RedisClient

    private constructor() {
      if (_.isNil(RedisHandler._redis)) {
        RedisHandler._redis = redis.createClient({
          port: getEnvironmentVariable(variables.REDIS_PORT.name),
          host: getEnvironmentVariable(variables.REDIS_URL.name)
        })
        RedisHandler._redis.on('error', (error: any) => {
          logger.error(caching.error(error))
          process.exit()
        }).on('connect', () => {
          logger.info(caching.success(getEnvironmentVariable(variables.REDIS_PORT.name), getEnvironmentVariable(variables.REDIS_URL.name)))
        })
      }
    }

    static getInstance(): RedisHandler {
      if (_.isNil(RedisHandler.instance)) {
        RedisHandler.instance = new RedisHandler()
      }
      return RedisHandler.instance
    }

    getRedisInstance(): RedisClient {
      return RedisHandler._redis
    }

    setKey(key: string, value: string, time?: number) {
      return new Promise<boolean>((resolve: (value?: boolean | PromiseLike<boolean>) => void, reject: (reason?: any) => void) => {
        if (!_.isNil(RedisHandler._redis) && RedisHandler._redis.connected) {
          RedisHandler._redis.set(key, value)
          if (!_.isNil(time)) {
            RedisHandler._redis.expire(key, time)
          }
          resolve(true)
        } else {
          resolve(false)
        }
      })
    }

    getKey(key: string) {
      return new Promise<string>((resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => {
        if (!_.isNil(RedisHandler._redis) && RedisHandler._redis.connected) {
          RedisHandler._redis.get(key, (error: Error | null, data: string) => {
            if (!_.isNil(error) && !_.isNil(data)) {
              resolve(data)
            }
            resolve(null)
          })
        } else {
          resolve(null)
        }
      })
    }
}
