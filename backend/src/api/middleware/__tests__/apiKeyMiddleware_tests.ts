import { NextFunction, Request, Response } from 'express'
import { apiKeyMiddleware } from '@root/api/middleware'

import request from 'supertest'
import { Express } from 'express-serve-static-core'

import apiKeyValidator from '@root/api/services/apiKeyValidator'
import { createServer } from '@root/utils/api/server'

//jest.mock('@root/api/services/apiKeyValidator')

// let server: Express
// beforeAll(async () => {
//   server = await createServer()
// })

// describe('apiKeyValidator failed ', () => {
//   it('should return 500 & valid response if auth rejects with an error', async () => {
//     ;(apiKeyValidator.validate as jest.Mock).mockResolvedValue({
//       error: { type: 'unauthorized', message: 'Authorization Failed' },
//     })

//     request(server)
//       .get(`/api/v1/goodbye`)
//       .set('Authorization', 'Bearer fakeToken')
//       .expect(500)
//       .end(function (err, res) {
//         if (err) return err
//         expect(res.body).toMatchObject({
//           error: {
//             type: 'internal_server_error',
//             message: 'Internal Server Error',
//           },
//         })
//       })
//   })
// })

describe('ApiKey middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  const writeHeadCallback = jest.fn()
  const endCallback = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      writeHead: writeHeadCallback,
      end: endCallback,
    }
  })

  test('without headers', async () => {
    const expectedResponse = {
      error: "Missing API key from the 'Authorization' header",
    }
    apiKeyMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(endCallback).toBeCalledTimes(1)
    expect(writeHeadCallback).toBeCalledTimes(1)

    // expect(mockResponse.writeHead).toBeCalledWith(401, {
    //   'Content-Type': 'application/json',
    // })
  })
})
