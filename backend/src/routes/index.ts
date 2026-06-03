import { Router } from 'express'
import { adminRouter } from './admin.routes'
import { resourceRouter } from '../modules/resources/resource.routes'

export const apiRouter = Router()

apiRouter.use('/resources', resourceRouter)
apiRouter.use('/admin', adminRouter)
