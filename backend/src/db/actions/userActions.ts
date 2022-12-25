import * as yup from 'yup'
import prisma, { User } from '@root/db/dbContext'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils'

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

export type ErrorResponse = { error: { type: string; message: string } }
export type CreateUserResult = User | ErrorResponse

export async function createUser(
  email: String,
  password: String
): Promise<CreateUserResult> {
  const user = {
    email,
    password,
  }

  return new Promise((resolve, reject) => {
    userSchema
      .validate(user)
      .then((validUser) => {
        prisma.user
          .create({ data: validUser })
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

export async function getUser(email: string): Promise<User> {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  })
}
