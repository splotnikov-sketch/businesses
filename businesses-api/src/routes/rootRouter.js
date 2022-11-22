import { Router } from 'express'

import accountRoutes from './accountRoutes'
import locationRoutes from './locationRoutes'
import businessesRoutes from './businessesRoutes'
import cdpRoutes from './cdpRoutes'

const rootRouter = Router()

rootRouter.use('/location', locationRoutes)
rootRouter.use('/account', accountRoutes)
rootRouter.use('/businesses', businessesRoutes)
rootRouter.use('/cdp', cdpRoutes)

export default rootRouter
