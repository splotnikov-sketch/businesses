import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Express } from 'express-serve-static-core'
import config from '@root/config'
import { createServer } from '@root/utils/api/server'
import dbContext from '@root/db/dbContext'
import { User } from '@root/db/dbContext'
import { insertUser, ErrorResult } from '@root/db/actions/userActions'

let server: Express

beforeAll(async () => {
  await dbContext.connect()
  server = await createServer()
})

afterAll(async () => {
  await dbContext.disconnect()
})

describe('POST /api/v1/login', () => {
  it('should return JWT token, userId, expireAt to a valid login/password', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = (await insertUser(email, password)) as User

    expect(user).not.toBeNull()
    expect(user.id).not.toBeNull()

    const data = {
      email,
      password,
    }

    const response = await request(server)
      .post(`/api/v1/login`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send(data)

    expect(response.status).toEqual(200)
    const { body } = response
    const { header } = response

    expect(body).not.toBeNull()

    expect(body).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
        token: expect.any(String),
        expireAt: expect.any(String),
      })
    )

    expect(header).not.toBeNull()
    expect(header['x-expires-after']).toEqual(expect.any(String))
  })
})

describe('POST /api/v1/login - failures', () => {
  it('should resolved with error if login does not exist', async () => {
    const email = 'some.email@somewhere.com'
    const password = '123456'

    const data = {
      email,
      password,
    }

    const response = await request(server)
      .post(`/api/v1/login`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send(data)

    expect(response.status).toEqual(401)
    const { body } = response
    expect((body as ErrorResult).error.type).toEqual('invalid_credentials')
  })

  it(`should resolved with error if password doesn't match`, async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = (await insertUser(email, password)) as User

    expect(user).not.toBeNull()
    expect(user.id).not.toBeNull()

    const data = {
      email,
      password: '123456',
    }

    const response = await request(server)
      .post(`/api/v1/login`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send(data)

    expect(response.status).toEqual(401)
    const { body } = response
    expect((body as ErrorResult).error.type).toEqual('invalid_credentials')
  })
})
