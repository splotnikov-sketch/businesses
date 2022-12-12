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

console.log('parsedEnv')
console.log(parsedEnv)

interface Config {
  port: number
  morganLogger: boolean
  morganBodyLogger: boolean
  devLogger: boolean
}

const config: Config = {
  port: parsedEnv.PORT as number,
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  devLogger: parsedEnv.DEV_LOGGER as boolean,
}

console.log('config')
console.log(config)

export default config
