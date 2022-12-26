import * as express from 'express'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'
import logger from '@root/utils/logger'
import {
  insertUser,
  getUser,
  ErrorResult,
  User,
} from '@root/db/actions/userActions'
import { isNullOrEmpty } from '@root/utils'
import { compareWithHash } from '@root/utils'
import { createAuthToken } from '@root/utils/auth'

export type LoginUserResponse =
  | ErrorResult
  | { token: string; userId: string; expireAt: Date }

export function createUser(req: express.Request, res: express.Response): void {
  const { email, password } = req.body
  if (isNullOrEmpty(email) || isNullOrEmpty(password)) {
    writeJsonResponse(res, 400, {
      error: {
        type: 'bad_request',
        message: 'Missing email or password',
      },
    })
  }

  insertUser(email, password)
    .then((result) => {
      if ((result as any).error) {
        if ((result as ErrorResult).error.type === 'account_already_exists') {
          writeJsonResponse(res, 409, result)
        } else {
          throw new Error(`unsupported ${result}`)
        }
      } else {
        const response = {
          userId: (result as User).id,
        }
        writeJsonResponse(res, 201, response)
      }
    })
    .catch((error: any) => {
      logger.error(`createUser: ${error}`)
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      })
      return
    })
}

export async function login(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { email, password } = req.body

  if (isNullOrEmpty(email) || isNullOrEmpty(password)) {
    writeJsonResponse(res, 400, {
      error: {
        type: 'bad_request',
        message: 'Missing email or password',
      },
    })
    return
  }

  const user = (await getUser(email)) as User
  if (isNullOrEmpty(user)) {
    writeJsonResponse(res, 404, {
      error: {
        type: 'invalid_credentials',
        message: 'Invalid email/password',
      },
    })
    return
  }
  const passwordMatch = await compareWithHash(password, user.password)

  if (!passwordMatch) {
    writeJsonResponse(res, 404, {
      error: {
        type: 'invalid_credentials',
        message: 'Invalid email/password',
      },
    })
    return
  }

  const token = await createAuthToken(user.id)
  const tokenExpiresDate = token.expireAt.toISOString()
  writeJsonResponse(
    res,
    200,
    { userId: user.id, token: token.token, expireAt: tokenExpiresDate },
    { 'X-Expires-After': tokenExpiresDate }
  )
  return
}
