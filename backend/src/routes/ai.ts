import express, { Request, Response } from 'express'
import * as aiService from '../services/aiService'

const router = express.Router()

// Analyze resume and extract data
router.post('/analyze-resume', async (req: Request, res: Response) => {
  console.log('Resume analysis requested')
  console.log('Resume text length:', req.body.resumeText?.length || 0)

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing delay

    const { resumeText } = req.body

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' })
    }

    const extractedData = await aiService.analyzeResume(resumeText)
    console.log('Extracted data:', extractedData)

    res.json({
      success: true,
      data: extractedData,
    })
  } catch (error) {
    console.error('Error analyzing resume:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume',
    })
  }
})

// Generate interview questions based on job role
router.post('/generate-questions', async (req: Request, res: Response) => {
  console.log('Question generation requested')
  console.log('Job role:', req.body.jobRole)

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing delay

    const { jobRole } = req.body

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required' })
    }

    const questions = await aiService.generateQuestions(jobRole)
    console.log(`Generated ${questions.length} questions for ${jobRole}`)

    res.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
    })
  }
})

// Evaluate candidate's answer
router.post('/evaluate-answer', async (req: Request, res: Response) => {
  console.log('Answer evaluation requested')
  console.log('Question:', req.body.question?.substring(0, 50) + '...')
  console.log('Answer length:', req.body.answer?.length || 0)

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing delay

    const { question, answer, difficulty } = req.body

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' })
    }

    const evaluation = await aiService.evaluateAnswer(question, answer)
    console.log('Evaluation result:', evaluation)

    res.json({
      success: true,
      data: evaluation,
    })
  } catch (error) {
    console.error('Error evaluating answer:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate answer',
    })
  }
})

// Generate final summary and feedback
router.post('/generate-summary', async (req: Request, res: Response) => {
  console.log('Summary generation requested')
  console.log('Number of answers:', req.body.answers?.length || 0)

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing delay

    const { answers, candidateInfo } = req.body

    if (!answers || answers.length === 0) {
      return res
        .status(400)
        .json({ error: 'Answers are required for summary generation' })
    }

    const summary = await aiService.generateSummary(
      answers,
      candidateInfo || {}
    )
    console.log('Generated summary:', summary)

    res.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Error generating summary:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary',
    })
  }
})

export default router
