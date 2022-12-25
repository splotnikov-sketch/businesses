import config from '@root/config'
import dbContext from '@root/db/dbContext'
import { createServer } from './utils/api/server'
import logger from '@root/utils/logger'

dbContext
  .connect()
  .then(() =>
    createServer()
      .then((server) => {
        server.listen(config.port, () => {
          logger.info(`Listening on port ${config.port}`)
        })
      })
      .catch((error) => {
        logger.error(`Error while creating server: ${error}`)
      })
  )
  .catch((error) => {
    logger.error(`Error: ${error}`)
  })
