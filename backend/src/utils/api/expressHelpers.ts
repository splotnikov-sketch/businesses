import { Response } from 'express'
import { OutgoingHttpHeaders } from 'http'

export function writeJsonResponse(
  res: Response,
  code: any,
  payload: any,
  headers?: OutgoingHttpHeaders | undefined
): void {
  const data =
    typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload

  res.writeHead(code, { ...headers, 'Content-Type': 'application/json' })

  res.end(data)
}

export function writeResponse500(res: Response): void {
  writeJsonResponse(res, 500, {
    error: {
      type: 'internal_server_error',
      message: 'Internal Server Error',
    },
  })
}

export function writeResponseError(
  res: Response,
  errorCode: number,
  errorType: string,
  errorMessage: string
): void {
  writeJsonResponse(res, errorCode, {
    error: {
      type: errorType,
      message: errorMessage,
    },
  })
}
