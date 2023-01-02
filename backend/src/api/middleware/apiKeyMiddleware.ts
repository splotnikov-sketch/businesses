import { RequestHandler } from 'express'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils/common'

import apiKeyValidator from '@root/api/services/apiKeyValidator'
import {
  writeJsonResponse,
  writeResponse500,
  writeResponseError,
} from '@root/utils/api/expressHelpers'

export const apiKeyMiddleware: RequestHandler = (req, res, next) => {
  if (
    isNullOrEmpty(req) ||
    isNullOrEmpty(req.headers) ||
    isNullOrEmpty(req.headers.authorization)
  ) {
    writeResponseError(
      res,
      401,
      'unauthorized',
      `Missing 'Authorization' header`
    )
    return
  }

  const token = req.headers.authorization ?? ''

  apiKeyValidator
    .validate(token)
    .then((authResponse) => {
      if (isNullOrEmpty((authResponse as any).error)) {
        const apiKey = (authResponse as { apiKey: string }).apiKey
        res.locals.apiKey = apiKey
        next()
      } else {
        writeJsonResponse(res, 401, authResponse)
      }
    })
    .catch((err) => {
      logger.error(`Error at apiKeyMiddleware: ${err}`)
      writeResponse500(res)
    })
}
