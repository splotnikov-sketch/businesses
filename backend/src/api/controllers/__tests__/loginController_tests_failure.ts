import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Express } from 'express-serve-static-core'
import config from '@root/config'
import { createServer } from '@root/utils/api/server'
import dbContext from '@root/db/dbContext'
import { insertUser, ErrorResult } from '@root/db/actions/userActions'

import * as mockAuth from '@root/utils/auth'
jest.mock('@root/utils/auth')

let server: Express

beforeAll(async () => {
  await dbContext.connect()
  server = await createServer()
})

afterAll(async () => {
  await dbContext.disconnect()
})

describe('POST /api/v1/login', () => {
  it('should return internal_server_error if jwt.sign fails with the error', async () => {
    ;(mockAuth.createAuthToken as jest.Mock).mockRejectedValue('error')
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = await insertUser(email, password)

    const data = {
      email,
      password,
    }

    const response = await request(server)
      .post(`/api/v1/login`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send(data)

    expect(response.status).toEqual(500)
    const { body } = response
    expect((body as ErrorResult).error.type).toEqual('internal_server_error')
  })
})
