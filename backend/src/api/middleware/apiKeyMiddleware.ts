import { NextFunction, Request, Response } from 'express'
import logger from '@root/utils/api/logger'
import { isNullOrEmpty } from '@root/utils'

import apiKeyValidator, {
  AuthResponse,
  ErrorResponse,
} from '@root/api/services/apiKeyValidator'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('request')
  console.log(req)
  if (
    isNullOrEmpty(req) ||
    isNullOrEmpty(req.headers) ||
    isNullOrEmpty(req.headers.authorization)
  ) {
    writeJsonResponse(res, 401, {
      error: {
        type: 'unauthorized',
        message: "Missing 'Authorization' header",
      },
    })
    return
  }

  const token = req.headers.authorization ?? ''

  apiKeyValidator
    .validate(token)
    .then((authResponse) => {
      if (isNullOrEmpty((authResponse as any).error)) {
        const apiKey = (authResponse as { apiKey: string }).apiKey

        res.locals.apiKey = apiKey

        console.log('next')
        console.log(next)

        next()
      } else {
        writeJsonResponse(res, 401, authResponse)
      }
    })
    .catch((err) => {
      logger.error(`Error at apiKeyMiddleware: ${err}`)
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      })
    })
}
