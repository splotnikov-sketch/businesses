// /config.js

import { BUSINESS_API_URI, API_KEY, CDP_TRACKING, CDP_CHANNEL } from '@env'

const config = {
  BUSINESS_API_URI: BUSINESS_API_URI,
  API_KEY: API_KEY,
  CDP_TRACKING: CDP_TRACKING === 'true',
  CDP_CHANNEL: CDP_CHANNEL,
}

console.log('config')
console.log(config)

export default config
