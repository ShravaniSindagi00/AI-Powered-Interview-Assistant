import React, { useState, useEffect } from 'react'
import { ResumeUpload } from './ResumeUpload'
import { CandidateForm } from './CandidateForm'
import { ChatInterface } from './ChatInterface'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Candidate, Question, Answer, InterviewSession } from '../types'
import * as api from '../services/api'
import {
  addCandidate,
  updateCandidate,
  saveSession,
  loadSession,
} from '../utils/storage'
import { CheckCircle, Trophy, ArrowRight } from 'lucide-react'

export function IntervieweeTab() {
  const [step, setStep] = useState<
    'upload' | 'form' | 'interview' | 'completed'
  >('upload')
  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalFeedback, setFinalFeedback] = useState('')
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [candidateId, setCandidateId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Check for existing session on mount
    const existingSession = loadSession()
    if (existingSession) {
      setShowWelcomeBack(true)
      setSession(existingSession)
    }
  }, [])

  const handleResumeProcessed = (data: any) => {
    setCandidateData((prev) => ({ ...prev, ...data }))
    setStep('form')
  }

  const handleFormSubmit = async (formData: any) => {
    setIsLoadingQuestions(true)
    setError('')

    try {
      // Create interview via API
      const interviewData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        position: formData.position,
        resumeText: candidateData.resumeText || '',
      }

      const result = await api.createNewInterview(interviewData)

      setCandidateId(result.candidateId)
      setCandidateData((prev) => ({
        ...prev,
        ...formData,
        id: result.candidateId,
      }))

      // Get questions from the created interview
      const candidateDetails = await api.getCandidateDetails(result.candidateId)
      setQuestions(candidateDetails.data.questions || [])

      // Create and save local session for UI state
      const newSession: InterviewSession = {
        candidateId: result.candidateId,
        currentQuestionIndex: 0,
        isActive: true,
        startedAt: new Date(),
        timeRemaining: candidateDetails.data.questions?.[0]?.timeLimit || 600,
      }

      setSession(newSession)
      saveSession(newSession)

      setStep('interview')
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleAnswerSubmit = (answer: Answer) => {
    const updatedAnswers = [...answers, answer]
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      // Update session
      const updatedSession: InterviewSession = {
        ...session!,
        currentQuestionIndex: nextIndex,
        timeRemaining: questions[nextIndex]?.timeLimit || 0,
      }
      setSession(updatedSession)
      saveSession(updatedSession)
    }
  }

  const handleInterviewComplete = async () => {
    if (!candidateId) {
      setError('No active interview found')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Complete interview via API
      const finalResult = await api.finishInterview(candidateId)

      setFinalScore(finalResult.finalScore)
      setFinalFeedback(finalResult.feedback)

      // Clear session after completion
      saveSession(null)
      setStep('completed')
    } catch (error: any) {
      console.error('Error completing interview:', error)
      setError(error.message || 'Failed to complete interview')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreSession = () => {
    if (session) {
      // This would need to load the candidate data from storage
      // For now, we'll just show a message
      setShowWelcomeBack(false)
      // You could implement full session restoration here
    }
  }

  const handleStartNewInterview = () => {
    saveSession(null)
    setSession(null)
    setShowWelcomeBack(false)
    setStep('upload')
    setCandidateData({})
    setQuestions([])
    setAnswers([])
    setCurrentQuestionIndex(0)
  }

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <ResumeUpload onResumeProcessed={handleResumeProcessed} />

      case 'form':
        return (
          <CandidateForm
            initialData={candidateData as any}
            onSubmit={handleFormSubmit}
          />
        )

      case 'interview':
        if (isLoadingQuestions) {
          return (
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Generating personalized questions...</p>
              </CardContent>
            </Card>
          )
        }

        return (
          <div className="h-full">
            <ChatInterface
              questions={questions}
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              candidateId={candidateId}
              onAnswerSubmit={handleAnswerSubmit}
              onComplete={handleInterviewComplete}
              timeRemaining={session?.timeRemaining}
            />
          </div>
        )

      case 'completed':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle>Interview Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Final Score</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {finalScore}/10
                </div>
                <Badge
                  variant={
                    finalScore >= 7
                      ? 'default'
                      : finalScore >= 4
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="text-sm"
                >
                  {finalScore >= 7
                    ? 'Excellent'
                    : finalScore >= 4
                    ? 'Good'
                    : 'Needs Improvement'}
                </Badge>
              </div>

              <p className="text-sm text-gray-600">{finalFeedback}</p>

              <Button onClick={handleStartNewInterview} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Start New Interview
              </Button>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="h-full flex items-center justify-center p-4">
        {renderStep()}
      </div>

      <Dialog open={showWelcomeBack} onOpenChange={setShowWelcomeBack}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              You have an interview session in progress. Would you like to
              continue where you left off?
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRestoreSession} className="flex-1">
                Continue Interview
              </Button>
              <Button
                variant="outline"
                onClick={handleStartNewInterview}
                className="flex-1"
              >
                Start New Interview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
