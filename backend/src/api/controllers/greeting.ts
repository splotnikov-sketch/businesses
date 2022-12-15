import * as express from 'express'
import { writeJsonResponse } from '@root/utils/api/express'

export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger'
  const message = `Hello, ${name}!`
  res.json({
    message: message,
  })
}

export function goodbye(req: express.Request, res: express.Response): void {
  const apiKey = res.locals.auth.apiKey
  writeJsonResponse(res, 200, { message: `Goodbye, ${apiKey}!` })
}
