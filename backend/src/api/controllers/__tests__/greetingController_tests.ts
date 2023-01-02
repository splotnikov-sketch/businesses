import request from 'supertest'
import { Express } from 'express-serve-static-core'
import config from '@root/config'

import { createServer } from '@root/utils/api/server'

let server: Express

beforeAll(async () => {
  server = await createServer()
})

describe('GET /hello', () => {
  it('should return 200 & valid response if request param list is empty', (done) => {
    request(server)
      .get(`/api/v1/hello`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({ message: 'Hello, stranger!' })
        done()
      })
  })

  it('should return 200 & valid response if name param is set', (done) => {
    request(server)
      .get(`/api/v1/hello?name=Test%20Name`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({ message: 'Hello, Test Name!' })
        done()
      })
  })

  it('should return 400 & valid error response if name param is empty', (done) => {
    request(server)
      .get(`/api/v1/hello?name=`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(/Empty.*\'name\'/),
            errors: expect.anything(),
          },
        })
        done()
      })
  })
})

describe('GET /goodbye', () => {
  it('should return 200 & valid response to authorization with fakeToken request', (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', `Bearer ${config.apiKey}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({
          message: `Goodbye, ${config.apiKey}!`,
        })
        done()
      })
  })

  it('should return 401 & valid error response to invalid authorization token', (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer invalidToken')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({
          error: { type: 'unauthorized', message: 'Authorization Failed' },
        })
        done()
      })
  })

  it('should return 401 & valid error response if authorization header field is missed', (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
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
