import * as express from 'express'

import apiKeyValidator, {
  AuthResponse,
  ErrorResponse,
} from '@root/api/services/apiKeyValidator'
import { writeJsonResponse } from '@root/utils/api/express'

export function apiKey(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = req.headers.authorization!
  apiKeyValidator
    .validate(token)
    .then((authResponse) => {
      if (!(authResponse as any).error) {
        res.locals.auth = {
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
