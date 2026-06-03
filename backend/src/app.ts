import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import { swaggerSpec } from './config/swagger'
import { apiRouter } from './routes'
import { notFoundMiddleware } from './middlewares/not-found.middleware'
import { errorMiddleware } from './middlewares/error.middleware'

export const app = express()

app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', apiRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)
