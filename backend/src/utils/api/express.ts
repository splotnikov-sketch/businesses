import * as express from 'express'
import { OutgoingHttpHeaders } from 'http'

export function writeJsonResponse(
  res: express.Response,
  code: any,
  payload: any,
  headers?: OutgoingHttpHeaders | undefined
): void {
  const data =
    typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload

  console.log('headers')
  const headersToWrite = { ...headers, 'Content-Type': 'application/json' }
  console.log(headersToWrite)
  console.log('code', code)
  console.log(res)

  res.writeHead(code, headersToWrite)
  res.end(data)
}
