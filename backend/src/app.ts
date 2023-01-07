import config from '@root/config'
import dbContext from '@root/db/dbContext'
import { createServer } from './utils/api/server'
import logger from '@root/utils/logger'
import { Cache } from '@root/utils/cache/Cache'

const redis = Cache.instance

;(async () => {
  try {
    await redis.connect()
    await dbContext.connect()
    const server = await createServer()
    server.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`)
    })
  } catch (error) {
    logger.error(`Error while creating server: ${error}`)
  }
})()
