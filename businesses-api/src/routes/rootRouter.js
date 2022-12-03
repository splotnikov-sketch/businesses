import { Router } from 'express'

import accountRoutes from './accountRoutes'
import locationRoutes from './locationRoutes'
import businessesRoutes from './businessesRoutes'
import cdpRoutes from './cdpRoutes'
import restaurantsRoutes from './restaurantsRoutes'

const rootRouter = Router()

rootRouter.use('/location', locationRoutes)
rootRouter.use('/account', accountRoutes)
rootRouter.use('/businesses', businessesRoutes)
rootRouter.use('/cdp', cdpRoutes)
rootRouter.use('/restaurants', restaurantsRoutes)

export default rootRouter
