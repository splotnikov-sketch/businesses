import * as express from 'express'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'
import logger from '@root/utils/logger'
import { insertUser, ErrorResult, User } from '@root/db/actions/userActions'

export function createUser(req: express.Request, res: express.Response): void {
  const { email, password } = req.body

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
    })
}
