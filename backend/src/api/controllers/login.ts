import * as express from 'express'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'
import { getUser, ErrorResult, User } from '@root/db/actions/userActions'
import { isNullOrEmpty } from '@root/utils'
import { compareWithHash } from '@root/utils'
import { createAuthToken } from '@root/utils/auth'

export type LoginUserResponse =
  | ErrorResult
  | { token: string; userId: string; expireAt: Date }

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

  const response = await getUser(email)
  if (!isNullOrEmpty((response as ErrorResult).error)) {
    writeJsonResponse(res, 401, {
      error: {
        type: 'invalid_credentials',
        message: 'Invalid email/password',
      },
    })
    return
  }

  const user = response as User
  const passwordMatch = await compareWithHash(password, user.password)

  if (!passwordMatch) {
    writeJsonResponse(res, 401, {
      error: {
        type: 'invalid_credentials',
        message: 'Invalid email/password',
      },
    })
    return
  }

  try {
    const token = await createAuthToken(user.id)
    const tokenExpiresDate = token.expireAt.toISOString()
    writeJsonResponse(
      res,
      200,
      { userId: user.id, token: token.token, expireAt: tokenExpiresDate },
      { 'X-Expires-After': tokenExpiresDate }
    )
    return
  } catch (error) {
    writeJsonResponse(res, 500, {
      error: {
        type: 'internal_server_error',
        message: 'Internal Server Error',
      },
    })
  }
}
