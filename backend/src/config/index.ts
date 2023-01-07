import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables from 'dotenv-parse-variables'

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
})

const parsedEnv = dotenvParseVariables(env)

// Define log levels type (silent + Winston default npm)
type LogLevel =
  | 'silent'
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly'

interface Config {
  port: number
  apiKey: string

  morganLogger: boolean
  morganBodyLogger: boolean
  devLogger: boolean
  loggerLevel: LogLevel

  databaseUrl: string

  privateKeyFile: string
  privateKeyPassphrase: string
  publicKeyFile: string

  localCacheTtl: number
  redisUrl: string

  yelp: {
    uri: string
    key: string
  }

  geoapify: {
    uri: string
    key: string
  }

  cdp: {
    uri: string
    browserUri: string
    key: string
    secret: string
    pointOfSale: string
    providerId: string
    offerTemplate: string
  }
}

const config: Config = {
  port: parsedEnv.PORT as number,
  apiKey: parsedEnv.API_KEY as string,

  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  devLogger: parsedEnv.DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,

  databaseUrl: parsedEnv.DATABASE_URL as string,

  privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
  privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
  publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,

  localCacheTtl: parsedEnv.LOCAL_CACHE_TTL as number,
  redisUrl: parsedEnv.REDIS_URL as string,

  yelp: {
    uri: parsedEnv.YELP_URI as string,
    key: parsedEnv.YELP_KEY as string,
  },

  geoapify: {
    uri: parsedEnv.GEOAPIFY_URI as string,
    key: parsedEnv.GEOAPIFY_KEY as string,
  },

  cdp: {
    uri: parsedEnv.CDP_URI as string,
    browserUri: parsedEnv.CDP_BROWSER_API_URI as string,
    key: parsedEnv.CDP_API_KEY_ID as string,
    secret: parsedEnv.CDP_API_SECRET as string,
    pointOfSale: parsedEnv.CDP_POINT_OF_SALE as string,
    providerId: parsedEnv.CDP_ID_PROVIDER as string,
    offerTemplate: parsedEnv.CDP_OFFER_TEMPLATE as string,
  },
}

export default config
