// src/models/InterviewSession.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IInterviewSession extends Document {
  candidateId: string
  currentQuestionIndex: number
  isActive: boolean
  startedAt: Date
  lastActivityAt: Date
  timeRemaining: number
  sessionData?: any // For storing temporary session state
  // Methods
  updateActivity(): Promise<void>
  complete(): Promise<void>
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    candidateId: {
      type: String,
      required: true,
      unique: true,
      ref: 'Candidate',
    },
    currentQuestionIndex: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    timeRemaining: {
      type: Number,
      default: 3600, // 1 hour in seconds
    },
    sessionData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
InterviewSessionSchema.index({ candidateId: 1 })
InterviewSessionSchema.index({ isActive: 1 })
InterviewSessionSchema.index({ lastActivityAt: -1 })

// Method to update last activity
InterviewSessionSchema.methods.updateActivity = function () {
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to mark session as completed
InterviewSessionSchema.methods.complete = function () {
  this.isActive = false
  this.lastActivityAt = new Date()
  return this.save()
}

// Static method to find active sessions
InterviewSessionSchema.statics.findActiveSessions = function () {
  return this.find({ isActive: true })
}

// Static method to cleanup old inactive sessions (older than 24 hours)
InterviewSessionSchema.statics.cleanupOldSessions = function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return this.deleteMany({
    isActive: false,
    lastActivityAt: { $lt: oneDayAgo },
  })
}

export const InterviewSession = mongoose.model<IInterviewSession>(
  'InterviewSession',
  InterviewSessionSchema
)

console.log('🎯 InterviewSession model initialized')
