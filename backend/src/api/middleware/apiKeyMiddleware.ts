import { NextFunction, Request, Response } from 'express'
import logger from '@root/utils/api/logger'

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
  if (!req.headers || !req.headers['authorization']) {
    writeJsonResponse(res, 403, {
      error: "Missing 'Authorization' header",
    })
  }

  const token = req?.headers?.authorization ?? ''
  apiKeyValidator
    .validate(token)
    .then((authResponse) => {
      logger.info('authResponse')
      logger.info(authResponse)
      if (!(authResponse as any).error) {
        res.locals.data = {
          apiKey: (authResponse as { apiKey: string }).apiKey,
        }
        next()
      } else {
        writeJsonResponse(res, 401, authResponse)
      }
    })
    .catch((err) => {
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      })
    })
}
