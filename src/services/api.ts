// src/services/api.ts
import { API_CONFIG } from '../config/api'

const API_BASE_URL = API_CONFIG.BASE_URL

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// ========================================
// AI Services (Phase 2 endpoints)
// ========================================

export const analyzeResume = async (resumeText: string) => {
  return await apiRequest('/ai/analyze-resume', {
    method: 'POST',
    body: JSON.stringify({ resumeText }),
  })
}

export const generateQuestions = async (
  jobRole: string,
  difficulty: string = 'medium'
) => {
  return await apiRequest('/ai/generate-questions', {
    method: 'POST',
    body: JSON.stringify({ jobRole, difficulty }),
  })
}

export const evaluateAnswer = async (
  question: string,
  answer: string,
  difficulty: string
) => {
  return await apiRequest('/ai/evaluate-answer', {
    method: 'POST',
    body: JSON.stringify({ question, answer, difficulty }),
  })
}

export const generateSummary = async (answers: any[], candidateInfo: any) => {
  return await apiRequest('/ai/generate-summary', {
    method: 'POST',
    body: JSON.stringify({ answers, candidateInfo }),
  })
}

// ========================================
// Interview Services (Phase 3 endpoints)
// ========================================

export const startInterview = async (candidateData: {
  name: string
  email: string
  phone: string
  jobRole: string
  resumeText: string
}) => {
  return await apiRequest('/interviews', {
    method: 'POST',
    body: JSON.stringify(candidateData),
  })
}

export const getAllCandidates = async () => {
  return await apiRequest('/interviews')
}

export const getCandidateDetails = async (candidateId: string) => {
  return await apiRequest(`/interviews/${candidateId}`)
}

export const saveAnswer = async (
  candidateId: string,
  answerData: {
    questionIndex?: number
    questionId?: string
    answer: string
    timeSpent?: number
  }
) => {
  return await apiRequest(`/interviews/${candidateId}/answer`, {
    method: 'PUT',
    body: JSON.stringify(answerData),
  })
}

export const completeInterview = async (candidateId: string) => {
  return await apiRequest(`/interviews/${candidateId}/complete`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export const getInterviewSession = async (candidateId: string) => {
  return await apiRequest(`/interviews/${candidateId}/session`)
}

// ========================================
// Health Check
// ========================================

export const healthCheck = async () => {
  return await apiRequest('/health')
}

// ========================================
// Helper functions for frontend integration
// ========================================

export const extractResumeData = async (resumeText: string) => {
  // Use the AI analyze-resume endpoint
  const result = await analyzeResume(resumeText)
  return result.data
}

export const createNewInterview = async (formData: {
  name: string
  email: string
  phone: string
  position: string
  resumeText: string
}) => {
  // Map frontend form data to backend API format
  const interviewData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    jobRole: formData.position,
    resumeText: formData.resumeText,
  }

  const result = await startInterview(interviewData)
  return result.data
}

export const getQuestionsForCandidate = async (candidateId: string) => {
  const candidate = await getCandidateDetails(candidateId)
  return candidate.data.questions
}

export const submitCandidateAnswer = async (
  candidateId: string,
  questionIndex: number,
  answer: string,
  timeSpent: number = 0
) => {
  return await saveAnswer(candidateId, {
    questionIndex,
    answer,
    timeSpent,
  })
}

export const finishInterview = async (candidateId: string) => {
  const result = await completeInterview(candidateId)
  return result.data
}

// Export for backward compatibility with existing frontend code
export const mockExtractResumeData = extractResumeData
export const mockGenerateQuestions = async (jobRole: string) => {
  const result = await generateQuestions(jobRole)
  return result.data
}

export const mockEvaluateAnswer = async (question: string, answer: string) => {
  const result = await evaluateAnswer(question, answer, 'Medium')
  return result.data
}

export const mockGenerateSummary = async (
  answers: any[],
  candidateInfo: any
) => {
  const result = await generateSummary(answers, candidateInfo)
  return result.data
}
