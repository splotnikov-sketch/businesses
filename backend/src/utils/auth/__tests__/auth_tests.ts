import { faker } from '@faker-js/faker'
import { createAuthToken } from '@root/utils/auth'

describe('createAuthToken', () => {
  test('should return JWT token, userId, expireAt to a valid login/password', async () => {
    const id = faker.datatype.uuid()

    const token = await createAuthToken(id)
    expect(token).not.toBeNull()

    expect(token).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        expireAt: expect.any(Date),
      })
    )
  })
})
