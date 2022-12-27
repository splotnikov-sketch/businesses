import { RequestHandler } from 'express'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils/common'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'
import { verifyAuthToken } from '@root/utils/auth'

const isError = (
  obj: unknown
): obj is { error: { type: string; message: string } } => {
  if (obj !== null && typeof obj === 'object') {
    return 'error' in obj
  }
  return false
}

const isValid = (obj: unknown): obj is { id: string } => {
  if (obj !== null && typeof obj === 'object') {
    return 'id' in obj
  }
  return false
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  if (
    isNullOrEmpty(req) ||
    isNullOrEmpty(req.headers) ||
    isNullOrEmpty(req.headers.authorization)
  ) {
    writeJsonResponse(res, 401, {
      error: {
        type: 'unauthorized',
        message: 'Authorization Failed',
      },
    })
    return
  }

  const bearerToken = req.headers.authorization ?? ''
  const token = bearerToken.replace('Bearer ', '')

  verifyAuthToken(token)
    .then((result: unknown) => {
      if (isValid(result)) {
        res.locals.id = result.id
        next()
        return
      }

      if (isError(result)) {
        writeJsonResponse(res, 401, result)
        return
      }

      writeJsonResponse(res, 401, {
        error: {
          type: 'unauthorized',
          message: "Missing 'Authorization' header",
        },
      })
      return
    })
    .catch((error) => {
      logger.error(`Error at authMiddleware: ${error}`)
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      })
    })
}
