import { faker } from '@faker-js/faker'
import prisma, { User } from '@root/db/dbContext'
import { createUser, getUser } from '@root/db/actions/userActions'
import { compareWithHash } from '@root/utils'

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('create user', () => {
  it('should create user if email and password are valid', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const before = Date.now()

    const user = (await createUser(email, password)) as User
    expect(user).not.toBeNull()
    expect(user.id).not.toBeNull()

    const fetched = await getUser(email)
    const after = Date.now()

    expect(fetched).not.toBeNull()
    expect(fetched!.email).toBe(email)
    expect(fetched!.password).not.toBe(password)
    expect(before).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)

    const isValidPassword = await compareWithHash(password, fetched!.password)

    expect(isValidPassword).toBe(true)
  })

  it('should resolves with false & valid error if email is empty ', async () => {
    const password = faker.internet.password()
    await expect(createUser('', password)).resolves.toEqual({
      error: {
        type: 'account_invalid',
        message: 'email is required',
      },
    })
  })

  it('should resolves with false & valid error if email is not valid ', async () => {
    const password = faker.internet.password()
    await expect(createUser('abc', password)).resolves.toEqual({
      error: {
        type: 'account_invalid',
        message: 'must be a valid email',
      },
    })
  })

  it('should resolves with false & valid error if password is empty ', async () => {
    const email = faker.internet.email()
    await expect(createUser(email, '')).resolves.toEqual({
      error: {
        type: 'account_invalid',
        message: 'password is required',
      },
    })
  })

  it('should resolves with false & valid error if password length is less then 6 characters', async () => {
    const email = faker.internet.email()
    const password = '12345'
    await expect(createUser(email, password)).resolves.toEqual({
      error: {
        type: 'account_invalid',
        message: 'password must be at least 6 characters long',
      },
    })
  })

  it('should resolves with false & valid error if duplicate email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = await createUser(email, password)

    await expect(createUser(email, password)).resolves.toEqual({
      error: {
        type: 'account_already_exists',
        message: `${email} already exists`,
      },
    })
  })
})
