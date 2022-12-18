import config from '@root/config'

export type ErrorResponse = { error: { type: string; message: string } }
export type AuthResponse = ErrorResponse | { apiKey: string }

function validate(bearerToken: string): Promise<AuthResponse> {
  return new Promise(function (resolve, reject) {
    console.log('bearerToken', bearerToken)
    const token = bearerToken.replace('Bearer ', '')
    if (token === config.apiKey) {
      console.log('token is valid')
      resolve({ apiKey: token })
    }

    resolve({
      error: {
        type: 'unauthorized',
        message: 'Authorization Failed',
      },
    })
  })
}

export default { validate }
