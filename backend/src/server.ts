import { app } from './app'
import { connectDatabase } from './config/database'
import { env } from './config/env'

async function startServer() {
  await connectDatabase()
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`)
  })
}

startServer()
