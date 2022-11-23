// config.js

import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  PORT: process.env.PORT || 3000,
  MONGO_CONNECTION_STRING: `${process.env.MONGODB_URI}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
  YELP_URI: process.env.YELP_URI,
  YELP_TOKEN: process.env.YELP_TOKEN,
  GEOAPIFY_URI: process.env.GEOAPIFY_URI,
  GEOAPIFY_KEY: process.env.GEOAPIFY_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CDP_BROWSER_API_URI: process.env.CDP_BROWSER_API_URI,
  CDP_URI: process.env.CDP_URI,
  CDP_API_KEY_ID: process.env.CDP_API_KEY_ID,
  CDP_API_SECRET: process.env.CDP_API_SECRET,
  CDP_POINT_OF_SAIL: process.env.CDP_POINT_OF_SAIL,
  CDP_ID_PROVIDER: process.env.CDP_ID_PROVIDER,
}

export default config
