import * as express from 'express'
import { writeJsonResponse } from '@root/utils/api/expressHelpers'

export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger'
  const message = `Hello, ${name}!`
  res.json({
    message: message,
  })
}

export function goodbye(req: express.Request, res: express.Response): void {
  const apiKey = res.locals.apiKey
  writeJsonResponse(res, 200, { message: `Goodbye, ${apiKey}!` })
}
