import { PrismaClient, Prisma, User } from '@prisma/client'
import { getHash } from '@root/utils'

global.prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

prisma.$use(async (params: any, next: any) => {
  if (
    params.model === 'User' &&
    (params.action === 'create' || params.action === 'update') &&
    params.args.data
  ) {
    if (params.args.data.password) {
      const hash = await getHash(params.args.data.password)
      return next({
        ...params,
        args: {
          data: {
            ...params.args.data,
            password: hash,
          },
        },
      })
    }
  }
  return next(params)
})

export default prisma

export { Prisma, User }
