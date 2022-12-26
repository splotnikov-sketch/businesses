import * as yup from 'yup'
import { User } from '@root/db/dbContext'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils/common'
import dbContext from '@root/db/dbContext'

let userSchema = yup.object().shape({
  email: yup
    .string()
    .required('email is required')
    .email('must be a valid email'),
  password: yup
    .string()
    .required('password is required')
    .min(6, 'password must be at least 6 characters long'),
})

export type ErrorResult = { error: { type: string; message: string } }
export type UserResult = User | ErrorResult

export { User }

export async function insertUser(
  email: String,
  password: String
): Promise<UserResult> {
  const user = {
    email,
    password,
  }

  return new Promise((resolve, reject) => {
    userSchema
      .validate(user)
      .then((validUser) => {
        dbContext
          .db()
          .user.create({ data: validUser })
          .then((createdUser: User) => {
            resolve(createdUser)
          })
          .catch((error: any) => {
            if (error.code === 'P2002') {
              resolve({
                error: {
                  type: 'account_already_exists',
                  message: `${email} already exists`,
                },
              })
            } else {
              logger.error(`createUser prisma error: ${error}`)
              reject(error)
            }
          })
      })
      .catch((error) => {
        logger.error(`createUser validation error: ${error}`)
        const errorMessage = `${
          !isNullOrEmpty(error.errors) ? error.errors : ''
        }`
        resolve({
          error: {
            type: 'account_invalid',
            message: errorMessage,
          },
        })
      })
  })
}

export async function getUser(email: string): Promise<UserResult> {
  return new Promise((resolve, reject) => {
    dbContext
      .db()
      .user.findUnique({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user == null) {
          resolve({
            error: {
              type: 'user_not_found',
              message: `User with email ${email} not found`,
            },
          })
        } else {
          resolve(user)
        }
      })
      .catch((error) => {
        logger.error(error)
        resolve({
          error: {
            type: 'internal_server_error',
            message: 'Internal Server Error',
          },
        })
      })
  })
}
