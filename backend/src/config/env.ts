import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5001),
  mongoUri:
    process.env.MONGO_URI ?? 'mongodb://mongo:27017/modular_form_creator',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
