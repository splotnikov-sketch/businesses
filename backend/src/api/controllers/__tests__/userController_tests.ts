import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Express } from 'express-serve-static-core'
import config from '@root/config'
import { createServer } from '@root/utils/api/server'
import dbContext from '@root/db/dbContext'
import { User } from '@root/db/dbContext'
import { insertUser } from '@root/db/actions/userActions'

let server: Express

beforeAll(async () => {
  await dbContext.connect()
  server = await createServer()
})

afterAll(async () => {
  await dbContext.disconnect()
})

describe('POST /api/v1/user', () => {
  it('should return 201 & valid response for valid user', (done) => {
    request(server)
      .post(`/api/v1/user`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201)
      .end(function (error, res) {
        if (error) {
          return done(error)
        }
        expect(res.body).toMatchObject({
          userId: expect.stringMatching(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
          ),
        })
        done()
      })
  })

  it('should return 409 & valid response for duplicated email', (done) => {
    const data = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    request(server)
      .post(`/api/v1/user`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send(data)
      .expect(201)
      .end(function (error, res) {
        if (error) {
          return done(error)
        }

        request(server)
          .post(`/api/v1/user`)
          .set('Authorization', `Bearer ${config.apiKey}`)
          .send(data)
          .expect(409)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).toMatchObject({
              error: {
                type: 'account_already_exists',
                message: expect.stringMatching(/already exists/),
              },
            })
            done()
          })
      })
  })

  it('should return 400 & valid response for invalid request', (done) => {
    request(server)
      .post(`/api/v1/user`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .send({
        mail: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(/email/),
          },
        })
        done()
      })
  })

  it('should return 401 & valid error response if authorization header field is missed', (done) => {
    request(server)
      .post(`/api/v1/user`)
      .send({
        mail: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: 'Authorization header required',
            errors: expect.anything(),
          },
        })
        done()
      })
  })
})

describe('POST /api/v1/login', () => {
  test('should return JWT token, userId, expireAt to a valid login/password', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = (await insertUser(email, password)) as User

    console.log('user')
    console.log(user)
    expect(user).not.toBeNull()
    expect(user.id).not.toBeNull()

    const data = {
      email: email,
      password: password,
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
