import * as redis from 'redis'
import { ICache } from '@root/utils/cache/ICache'

import config from '@root/config'
import logger from '@root/utils/logger'
import { promisify } from 'util'

export class Cache implements ICache {
  private static _instance: Cache
  private _client
  private _initialConnection: boolean

  private getAsync: (key: string) => Promise<string | undefined>
  private setAsync: (
    key: string,
    value: string,
    ex: string,
    expireAfter: number
  ) => Promise<void>

  private constructor(options: redis.RedisClientOptions) {
    this._initialConnection = true

    this._client = redis.createClient(options)

    this.getAsync = promisify(this._client.get).bind(this._client)
    this.setAsync = promisify(this._client.set).bind(this._client)

    this._client.on('error', (err) => {
      logger.error(`Error: ${err}`)
    })

    this._client.on('connect', () => {
      logger.info('Connected to Redis')
    })

    this._client.on('ready', () => {
      if (this._initialConnection) {
        this._initialConnection = false
      }
      logger.info('Redis: ready')
    })

    this._client.on('reconnecting', () => {
      logger.info('Redis: reconnecting')
    })

    this._client.on('end', () => {
      logger.info('Redis: end')
    })

    this._client.on('disconnected', () => {
      logger.error('Redis: disconnected')
    })
  }

  public static get instance(): Cache {
    if (!Cache._instance) {
      Cache._instance = new Cache({ url: config.redisUrl })
    }
    return Cache._instance
  }

  async connect(): Promise<void> {
    return this._client.connect()
  }

  async get(key: string): Promise<string | undefined> {
    return await this.getAsync(key)
  }

  async set(key: string, value: string, expireAfter: number): Promise<void> {
    await this.setAsync(key, value, 'EX', expireAfter)
  }

  async close(): Promise<void> {
    return this._client.quit()
  }
}
