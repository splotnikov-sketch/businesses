import { NextFunction, Request, Response } from 'express'
import { apiKeyMiddleware } from '@root/api/middleware'

import request from 'supertest'
import { Express } from 'express-serve-static-core'

import apiKeyValidator from '@root/api/services/apiKeyValidator'
import { createServer } from '@root/utils/api/server'

describe('ApiKey middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  const writeHeadCallback = jest.fn()
  const endCallback = jest.fn()
  const writeJsonResponse = jest.fn()
  const jsonCallback = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      writeHead: writeHeadCallback,
      end: endCallback,
      json: jsonCallback,
    }
  })

  test('without headers', async () => {
    const expectedResponse = JSON.stringify(
      {
        error: "Missing 'Authorization' header",
      },
      null,
      2
    )
    apiKeyMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    console.log(endCallback.mock)

    expect(endCallback).toBeCalledTimes(1)
    expect(endCallback).toBeCalledWith(expectedResponse)
  })
})
