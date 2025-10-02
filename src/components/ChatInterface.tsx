import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Timer } from './Timer'
import { Question, Answer } from '../types'
import * as api from '../services/api'
import { Bot, User, Send, Loader2 } from 'lucide-react'

interface ChatInterfaceProps {
  questions: Question[]
  answers: Answer[]
  currentQuestionIndex: number
  candidateId: string
  onAnswerSubmit: (answer: Answer) => void
  onComplete: () => void
  timeRemaining?: number
}

export function ChatInterface({
  questions,
  answers,
  currentQuestionIndex,
  candidateId,
  onAnswerSubmit,
  onComplete,
  timeRemaining,
}: ChatInterfaceProps) {
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const chatEndRef = useRef<HTMLDivElement>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  useEffect(() => {
    setStartTime(new Date())
    setCurrentAnswer('')
  }, [currentQuestionIndex])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentQuestionIndex, answers])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting || !candidateId) return

    setIsSubmitting(true)
    const timeSpent = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    )

    try {
      // Save answer directly to backend
      const result = await api.submitCandidateAnswer(
        candidateId,
        currentQuestionIndex,
        currentAnswer,
        timeSpent
      )

      const answer: Answer = {
        questionId: currentQuestion.id,
        text: currentAnswer,
        score: result.data.score,
        feedback: result.data.feedback,
        timeSpent,
        answeredAt: new Date(),
      }

      onAnswerSubmit(answer)

      if (isLastQuestion) {
        onComplete()
      }
    } catch (error) {
      console.error('Error saving answer:', error)
      // Still allow local progress even if API fails
      const answer: Answer = {
        questionId: currentQuestion.id,
        text: currentAnswer,
        score: 0,
        feedback: 'Answer saved but not evaluated due to connection error',
        timeSpent,
        answeredAt: new Date(),
      }
      onAnswerSubmit(answer)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    if (currentAnswer.trim()) {
      handleSubmitAnswer()
    } else {
      // Submit empty answer
      const answer: Answer = {
        questionId: currentQuestion.id,
        text: '',
        score: 0,
        feedback: 'Time expired without an answer.',
        timeSpent: currentQuestion.timeLimit,
        answeredAt: new Date(),
      }
      onAnswerSubmit(answer)

      if (isLastQuestion) {
        onComplete()
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Previous Q&As */}
        {questions.slice(0, currentQuestionIndex).map((question, index) => {
          const answer = answers[index]
          return (
            <div key={question.id} className="space-y-3">
              {/* Question */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <Card className="flex-1">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={getDifficultyColor(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {question.category}
                      </span>
                    </div>
                    <p>{question.text}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Answer */}
              {answer && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-4">
                      <p className="mb-3">
                        {answer.text || 'No answer provided'}
                      </p>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Score:{' '}
                            <span className="font-semibold">
                              {answer.score}/10
                            </span>
                          </span>
                          <span>Time: {answer.timeSpent}s</span>
                        </div>
                        <p className="text-sm text-gray-600 italic">
                          {answer.feedback}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )
        })}

        {/* Current Question */}
        {currentQuestion && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <Card className="flex-1">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={getDifficultyColor(currentQuestion.difficulty)}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {currentQuestion.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <p>{currentQuestion.text}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {currentQuestion && (
        <div className="border-t p-4 space-y-4">
          <Timer
            timeLimit={currentQuestion.timeLimit}
            onTimeUp={handleTimeUp}
            isActive={!isSubmitting}
            initialTime={timeRemaining}
          />

          <div className="space-y-3">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {currentAnswer.length} characters
              </span>

              <Button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit {isLastQuestion ? '& Finish' : 'Answer'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
