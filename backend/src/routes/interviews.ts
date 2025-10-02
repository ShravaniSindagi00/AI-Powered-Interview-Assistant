// src/routes/interviews.ts
import express, { Request, Response } from 'express'
import { Candidate, ICandidate } from '../models/Candidate'
import { InterviewSession, IInterviewSession } from '../models/InterviewSession'
import * as aiService from '../services/aiService'

const router = express.Router()

// ========================================
// POST /api/interviews - Start new interview
// ========================================
router.post('/', async (req: Request, res: Response) => {
  console.log('🚀 Starting new interview...')

  try {
    const { name, email, phone, jobRole, resumeText } = req.body

    // Validate required fields
    if (!name || !email || !jobRole || !resumeText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, jobRole, resumeText',
      })
    }

    // Check if candidate with same email already exists
    const existingCandidate = await Candidate.findOne({ email })
    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        error: 'Candidate with this email already exists',
        candidateId: existingCandidate.id,
      })
    }

    // Generate questions using AI service
    console.log(`🤖 Generating questions for ${jobRole}...`)
    const questions = await aiService.generateQuestions(jobRole)

    // Create new candidate
    const candidateData = {
      name,
      email,
      phone: phone || '',
      jobRole,
      resumeText,
      questions,
      answers: [],
      finalScore: 0,
      finalFeedback: '',
      status: 'in-progress' as const,
    }

    const candidate = new Candidate(candidateData)
    await candidate.save()

    // Create interview session
    const sessionData = {
      candidateId: candidate.id,
      currentQuestionIndex: 0,
      isActive: true,
      timeRemaining: 3600, // 1 hour
    }

    const session = new InterviewSession(sessionData)
    await session.save()

    console.log(`✅ New interview created for ${name} (${email})`)
    console.log(`📝 Generated ${questions.length} questions`)

    res.status(201).json({
      success: true,
      data: {
        candidateId: candidate.id,
        sessionId: session.id,
        questions: questions.length,
        message: 'Interview started successfully',
      },
    })
  } catch (error: any) {
    console.error('❌ Error starting interview:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to start interview',
      details: error.message,
    })
  }
})

// ========================================
// GET /api/interviews - Get all candidates (for interviewer dashboard)
// ========================================
router.get('/', async (req: Request, res: Response) => {
  console.log('📋 Fetching all candidates...')

  try {
    const candidates = await Candidate.find()
      .select(
        'id name email jobRole finalScore status createdAt completedAt answers questions'
      )
      .sort({ createdAt: -1 })

    console.log(`✅ Found ${candidates.length} candidates`)

    res.json({
      success: true,
      data: candidates.map((candidate: ICandidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        jobRole: candidate.jobRole,
        finalScore: candidate.finalScore,
        status: candidate.status,
        createdAt: candidate.createdAt,
        completedAt: candidate.completedAt,
        questionsAnswered: candidate.answers?.length || 0,
        totalQuestions: candidate.questions?.length || 0,
      })),
    })
  } catch (error: any) {
    console.error('❌ Error fetching candidates:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates',
      details: error.message,
    })
  }
})

// ========================================
// GET /api/interviews/:id - Get specific candidate details
// ========================================
router.get('/:id', async (req: Request, res: Response) => {
  console.log(`🔍 Fetching candidate details: ${req.params.id}`)

  try {
    const candidate = await Candidate.findOne({ id: req.params.id })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      })
    }

    console.log(`✅ Found candidate: ${candidate.name}`)

    res.json({
      success: true,
      data: candidate,
    })
  } catch (error: any) {
    console.error('❌ Error fetching candidate:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidate',
      details: error.message,
    })
  }
})

// ========================================
// PUT /api/interviews/:id/answer - Save candidate's answer
// ========================================
router.put('/:id/answer', async (req: Request, res: Response) => {
  console.log(`💾 Saving answer for candidate: ${req.params.id}`)

  try {
    const { questionIndex, questionId, answer, timeSpent } = req.body

    // Accept either questionIndex or questionId
    if ((!questionIndex && questionIndex !== 0 && !questionId) || !answer) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: (questionIndex or questionId) and answer',
      })
    }

    // Find candidate
    const candidate = await Candidate.findOne({ id: req.params.id })
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      })
    }

    // Find the question by index or id
    let question: any
    let finalQuestionId: string

    if (questionIndex !== undefined) {
      question = candidate.questions[questionIndex]
      finalQuestionId = question?.id
    } else {
      question = candidate.questions.find((q: any) => q.id === questionId)
      finalQuestionId = questionId
    }

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      })
    }

    // Check if answer already exists
    const existingAnswerIndex = candidate.answers.findIndex(
      (a: any) => a.questionId === finalQuestionId
    )

    // Evaluate answer using AI service
    console.log(`🤖 Evaluating answer for question: ${questionId}`)
    const evaluation = await aiService.evaluateAnswer(
      question.text,
      answer,
      question.difficulty
    )

    // Create answer object
    const answerData = {
      questionId: finalQuestionId,
      text: answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      timeSpent: timeSpent || 0,
      answeredAt: new Date(),
    }

    // Update or add answer
    if (existingAnswerIndex >= 0) {
      candidate.answers[existingAnswerIndex] = answerData as any
    } else {
      candidate.answers.push(answerData as any)
    }

    // Update candidate
    await candidate.save()

    // Update session activity
    const session = await InterviewSession.findOne({
      candidateId: candidate.id,
    })
    if (session) {
      await session.updateActivity()
    }

    console.log(`✅ Answer saved with score: ${evaluation.score}/10`)

    res.json({
      success: true,
      data: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        questionsAnswered: candidate.answers.length,
        totalQuestions: candidate.questions.length,
      },
    })
  } catch (error: any) {
    console.error('❌ Error saving answer:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to save answer',
      details: error.message,
    })
  }
})

// ========================================
// POST /api/interviews/:id/complete - Complete interview
// ========================================
router.post('/:id/complete', async (req: Request, res: Response) => {
  console.log(`🏁 Completing interview for candidate: ${req.params.id}`)

  try {
    // Find candidate
    const candidate = await Candidate.findOne({ id: req.params.id })
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      })
    }

    // Generate final summary using AI service
    console.log('🤖 Generating final interview summary...')
    const summary = await aiService.generateSummary(candidate.answers, {
      name: candidate.name,
      jobRole: candidate.jobRole,
      email: candidate.email,
    })

    // Update candidate with summary
    candidate.finalScore = summary.overallScore
    candidate.finalFeedback = summary.feedback
    candidate.overallScore = summary.overallScore
    candidate.totalQuestions = summary.totalQuestions
    candidate.feedback = summary.feedback
    candidate.strengths = summary.strengths
    candidate.areasForImprovement = summary.areasForImprovement
    candidate.recommendation = summary.recommendation
    candidate.status = 'completed'
    candidate.completedAt = new Date()

    await candidate.save()

    // Complete session
    const session = await InterviewSession.findOne({
      candidateId: candidate.id,
    })
    if (session) {
      await session.complete()
    }

    console.log(`✅ Interview completed for ${candidate.name}`)
    console.log(`📊 Final Score: ${summary.overallScore}/10`)
    console.log(`🎯 Recommendation: ${summary.recommendation}`)

    res.json({
      success: true,
      data: {
        finalScore: summary.overallScore,
        feedback: summary.feedback,
        recommendation: summary.recommendation,
        strengths: summary.strengths,
        areasForImprovement: summary.areasForImprovement,
        completedAt: candidate.completedAt,
      },
    })
  } catch (error: any) {
    console.error('❌ Error completing interview:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to complete interview',
      details: error.message,
    })
  }
})

// ========================================
// GET /api/interviews/:id/session - Get interview session
// ========================================
router.get('/:id/session', async (req: Request, res: Response) => {
  try {
    const session = await InterviewSession.findOne({
      candidateId: req.params.id,
    })

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }

    res.json({
      success: true,
      data: session,
    })
  } catch (error: any) {
    console.error('❌ Error fetching session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
      details: error.message,
    })
  }
})

export default router
