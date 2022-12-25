import config from '@root/config'
import db from '@root/utils/db_1'
import { createServer } from './utils/api/server'
import logger from '@root/utils/logger'

createServer()
  .then((server) => {
    server.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`)
    })
  })
  .catch((err) => {
    logger.error(`Error while creating server: ${err}`)
  })
