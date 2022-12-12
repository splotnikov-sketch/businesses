import config from '@root/config'
import { createServer } from './utils/server'

createServer()
  .then((server) => {
    server.listen(config.port, () => {
      console.info(`Listening on port ${config.port}`)
    })
  })
  .catch((err) => {
    console.error(`Error: ${err}`)
  })
