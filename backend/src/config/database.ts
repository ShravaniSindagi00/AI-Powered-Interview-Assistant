// src/config/database.ts
import mongoose from 'mongoose'

console.log('🔧 Initializing MongoDB connection...')

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is required')
      process.exit(1)
    }

    console.log('📡 Connecting to MongoDB...')

    const conn = await mongoose.connect(mongoURI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connection established')
})

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB disconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('💤 MongoDB connection closed through app termination')
  process.exit(0)
})

export default connectDB
