import config from '@root/config'
import { createServer } from './utils/server'
import logger from '@root/utils/logger'

createServer()
  .then((server) => {
    server.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`)
    })
  })
  .catch((err) => {
    logger.error(`Error: ${err}`)
  })
