import 'express' // Modifies global namespace, so include it!

declare global {
  /* Global variables follow. They *must* use var to work.
        and cannot be initialized here. */

  // eslint-disable-next-line no-var
  var prisma: PrismaClient
}

export {}
