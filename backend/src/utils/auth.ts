import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'
import config from '@root/config'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils/common'

const privateKey = fs.readFileSync(config.privateKeyFile)

const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase,
}

//TODO: move hardcoded values to config
const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '14d',
}

const publicKey = fs.readFileSync(config.publicKeyFile)

const verifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
  complete: true,
}

const secInWeek = 604800

export type AuthError = { error: { type: string; message: string } }
export type AuthResult = AuthError | { id: string }

export function createAuthToken(
  id: string
): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      { id },
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

export function verifyAuthToken(token: string): Promise<AuthResult> {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
      if (err === null && !isNullOrEmpty(decoded)) {
        const decodedObj = decoded as { payload: { id?: string; exp: number } }
        const expired = Date.now() >= decodedObj.payload.exp * 1000
        if (decodedObj.payload.id && !expired) {
          resolve({ id: decodedObj.payload.id })
          return
        }
      }
      resolve({
        error: { type: 'unauthorized', message: 'Authentication Failed' },
      })
    })
  })
}
