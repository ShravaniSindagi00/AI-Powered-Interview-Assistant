import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

// Import routes and middleware
import aiRoutes from './routes/ai'
import interviewRoutes from './routes/interviews'
import { requestLogger, errorHandler, notFoundHandler } from './middleware'
import connectDB from './config/database'

const app = express()
const PORT = process.env.PORT || 3001

// Initialize services
const initializeServer = async () => {
  try {
    // Connect to database
    console.log('🔗 Connecting to database...')
    await connectDB()

    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Middleware setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestLogger)

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check requested')
  res.json({
    status: 'OK',
    message: 'Dynamic AI Interview Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API routes
app.use('/api/ai', aiRoutes)
app.use('/api/interviews', interviewRoutes)

// Error handling
app.use(errorHandler)
app.use('*', notFoundHandler)

// Initialize and start server
initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Dynamic AI Interview Backend running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🤖 AI API: http://localhost:${PORT}/api/ai`)
    console.log(`💾 Interview API: http://localhost:${PORT}/api/interviews`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(
      `🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
    )
  })
})
