/* istanbul ignore file */

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import config from '@root/config'
import logger from '@root/utils/logger'

mongoose.Promise = global.Promise
mongoose.set('debug', process.env.DEBUG !== undefined)

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: config.mongo.useCreateIndex,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  autoIndex: config.mongo.autoIndex,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

class MongoConnection {
  private static _instance: MongoConnection

  private _mongoServer?: MongoMemoryServer

  static getInstance(): MongoConnection {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection()
    }
    return MongoConnection._instance
  }

  public async open(): Promise<void> {
    try {
      const mongoUrlRemote = `${config.mongo.url}/${config.mongo.db}`

      if (config.mongo.url === 'inMemory') {
        logger.debug('connecting to inMemory mongo db')
        this._mongoServer = await MongoMemoryServer.create()
        const mongoUrl = this._mongoServer.getUri()
        await mongoose.connect(mongoUrl, options)
      } else {
        logger.debug(`connecting to mongo db: ${mongoUrlRemote}`)
        mongoose.connect(config.mongo.url, options)
      }

      mongoose.connection.on('connected', () => {
        logger.info('Mongo: connected')
      })

      mongoose.connection.on('disconnected', () => {
        logger.error('Mongo: disconnected')
      })

      mongoose.connection.on('error', (err) => {
        logger.error(`Mongo:  ${String(err)}`)
        if (err.name === 'MongoNetworkError') {
          setTimeout(function () {
            mongoose.connect(mongoUrlRemote, options).catch(() => {})
          }, 5000)
        }
      })
    } catch (err) {
      logger.error(`db.open: ${err}`)
      throw err
    }
  }

  public async close(): Promise<void> {
    try {
      await mongoose.disconnect()
      if (config.mongo.url === 'inMemory') {
        await this._mongoServer!.stop()
      }
    } catch (err) {
      logger.error(`db.open: ${err}`)
      throw err
    }
  }
}

export default MongoConnection.getInstance()
