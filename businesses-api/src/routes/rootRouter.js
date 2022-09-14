import { Router } from 'express';

import accountRoutes from './accountRoutes';
import locationRoutes from './locationRoutes';
import businessesRoutes from './businessesRoutes';

const rootRouter = Router();

rootRouter.use('/location', locationRoutes);
rootRouter.use('/account', accountRoutes);
rootRouter.use('/businesses', businessesRoutes);

export default rootRouter;
