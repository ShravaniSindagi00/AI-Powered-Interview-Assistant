// src/models/Candidate.ts
import mongoose, { Schema, Document } from 'mongoose'

// Define interfaces extending Document for MongoDB
export interface IAnswer extends Document {
  questionId: string
  text: string
  score: number
  feedback: string
  timeSpent: number
  answeredAt: Date
}

export interface IQuestion extends Document {
  id: string
  text: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeLimit: number
  category: string
}

export interface ICandidate extends Document {
  id: string
  name: string
  email: string
  phone: string
  jobRole: string
  resumeText: string
  questions: IQuestion[]
  answers: IAnswer[]
  finalScore: number
  finalFeedback: string
  overallScore?: number
  totalQuestions?: number
  feedback?: string
  strengths?: string[]
  areasForImprovement?: string[]
  recommendation?: string
  createdAt: Date
  completedAt?: Date
  status: 'pending' | 'in-progress' | 'completed'
  // Methods
  calculateAverageScore(): number
}

// Answer subdocument schema
const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: String, required: true },
    text: { type: String, required: true },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    feedback: { type: String, required: true },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

// Question subdocument schema
const QuestionSchema = new Schema<IQuestion>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
      min: 60,
      max: 1800,
    },
    category: { type: String, required: true },
  },
  { _id: false }
)

// Main Candidate schema
const CandidateSchema = new Schema<ICandidate>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        message: 'Please enter a valid email address',
      },
    },
    phone: { type: String, default: '' },
    jobRole: { type: String, required: true },
    resumeText: { type: String, required: true },
    questions: [QuestionSchema],
    answers: [AnswerSchema],
    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    finalFeedback: { type: String, default: '' },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    totalQuestions: { type: Number },
    feedback: { type: String },
    strengths: [String],
    areasForImprovement: [String],
    recommendation: {
      type: String,
      enum: ['Highly Recommended', 'Recommended', 'Maybe', 'Not Recommended'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Add compound index for email uniqueness
CandidateSchema.index({ email: 1 }, { unique: true })

// Add text index for searching
CandidateSchema.index({
  name: 'text',
  email: 'text',
  jobRole: 'text',
})

// Methods
CandidateSchema.methods.calculateAverageScore = function () {
  if (this.answers.length === 0) return 0

  const totalScore = this.answers.reduce(
    (sum: number, answer: any) => sum + answer.score,
    0
  )
  return Math.round((totalScore / this.answers.length) * 100) / 100
}

// Pre-save middleware to update finalScore
CandidateSchema.pre('save', function (next) {
  if (this.answers && this.answers.length > 0) {
    this.finalScore = this.calculateAverageScore()
  }
  next()
})

// Virtual for completion percentage
CandidateSchema.virtual('completionPercentage').get(function () {
  if (this.questions.length === 0) return 0
  return Math.round((this.answers.length / this.questions.length) * 100)
})

// Virtual for time taken
CandidateSchema.virtual('totalTimeSpent').get(function () {
  return this.answers.reduce(
    (total: number, answer: any) => total + (answer.timeSpent || 0),
    0
  )
})

export const Candidate = mongoose.model<ICandidate>(
  'Candidate',
  CandidateSchema
)
