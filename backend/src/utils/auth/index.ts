import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'
import config from '@root/config'
import logger from '@root/utils/logger'

const privateKey = fs.readFileSync(config.privateKeyFile)

const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase,
}

const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '14d',
}

const secInWeek = 604800

export function createAuthToken(
  id: string
): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      { id: id },
      privateSecret,
      signOptions,
      (error: Error | null, encoded: string | undefined) => {
        if (error === null && encoded !== undefined) {
          const expireAfter = 2 * secInWeek
          const expireAt = new Date()
          expireAt.setSeconds(expireAt.getSeconds() + expireAfter)
          resolve({ token: encoded, expireAt: expireAt })
        } else {
          logger.error(`createAuthToken error: ${error}`)
          reject(error)
        }
      }
    )
  })
}
