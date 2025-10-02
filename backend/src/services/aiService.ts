// src/services/aiService.ts
// Phase 2: Local Data Extraction & Simulated AI Logic

import {
  Question,
  ResumeAnalysisResult,
  AnswerEvaluation,
  FinalSummary,
} from '../types'

console.log('🎯 Initializing Local AI Service (Phase 2)')
console.log('✅ No external APIs required - fully local solution')

// ========================================
// 1. LOCAL RESUME PARSING (RegEx-based)
// ========================================
export const analyzeResume = async (
  resumeText: string
): Promise<ResumeAnalysisResult> => {
  console.log('🔍 Starting local resume analysis...')
  console.log('📄 Resume text length:', resumeText.length)

  try {
    // Simulate processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 🎯 RegEx patterns for data extraction
    const patterns = {
      email: /[\w\.-]+@[\w\.-]+\.\w+/gi,
      phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      // Enhanced name patterns
      name: [
        // Pattern: "Name: John Doe" or "Name - John Doe"
        /(?:name|candidate)[:\-\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
        // Pattern: First line with title case words
        /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
        // Pattern: Between common resume sections
        /(?:resume|cv|curriculum)[^\n]*\n.*?([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
      ],
    }

    // Extract email
    const emailMatch = resumeText.match(patterns.email)
    const email = emailMatch ? emailMatch[0] : ''

    // Extract phone
    const phoneMatch = resumeText.match(patterns.phone)
    const phone = phoneMatch ? phoneMatch[0] : ''

    // Extract name using multiple patterns
    let name = ''
    for (const pattern of patterns.name) {
      const match = resumeText.match(pattern)
      if (match && match[1]) {
        name = match[1].trim()
        break
      }
    }

    // Job role inference using keyword matching
    const jobRoleKeywords = {
      'Frontend Developer': [
        'react',
        'vue',
        'angular',
        'javascript',
        'typescript',
        'html',
        'css',
        'frontend',
        'front-end',
        'ui',
        'ux',
        'web development',
        'responsive',
      ],
      'Backend Developer': [
        'node',
        'python',
        'java',
        'spring',
        'django',
        'flask',
        'backend',
        'back-end',
        'api',
        'server',
        'database',
        'microservices',
        'rest',
      ],
      'Full Stack Developer': [
        'fullstack',
        'full-stack',
        'full stack',
        'mean',
        'mern',
        'lamp',
        'end-to-end',
        'frontend and backend',
      ],
      'Data Scientist': [
        'python',
        'r',
        'machine learning',
        'ml',
        'data science',
        'pandas',
        'numpy',
        'tensorflow',
        'pytorch',
        'analytics',
        'statistics',
      ],
      'DevOps Engineer': [
        'devops',
        'aws',
        'azure',
        'docker',
        'kubernetes',
        'jenkins',
        'ci/cd',
        'terraform',
        'ansible',
        'linux',
        'cloud',
      ],
      'Product Manager': [
        'product manager',
        'product management',
        'product strategy',
        'roadmap',
        'agile',
        'scrum',
        'stakeholder',
      ],
      'QA Engineer': [
        'qa',
        'quality assurance',
        'testing',
        'automation',
        'selenium',
        'test cases',
        'bug tracking',
        'quality',
      ],
      'Software Engineer': [
        'software engineer',
        'software development',
        'programming',
        'coding',
        'algorithms',
        'data structures',
      ],
    }

    let inferredRole = 'Software Engineer' // Default
    const resumeLower = resumeText.toLowerCase()
    let maxMatches = 0

    // Find job role with most keyword matches
    for (const [role, keywords] of Object.entries(jobRoleKeywords)) {
      const matches = keywords.filter((keyword) =>
        resumeLower.includes(keyword.toLowerCase())
      ).length

      if (matches > maxMatches) {
        maxMatches = matches
        inferredRole = role
      }
    }

    const result = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      jobRole: inferredRole,
    }

    console.log('✅ Local resume analysis completed:')
    console.log('  📧 Email:', result.email)
    console.log('  📱 Phone:', result.phone)
    console.log('  👤 Name:', result.name)
    console.log('  💼 Job Role:', result.jobRole)
    console.log('  🎯 Keyword matches:', maxMatches)

    return result
  } catch (error) {
    console.error('❌ Error in local resume analysis:', error)
    return {
      name: '',
      email: '',
      phone: '',
      jobRole: 'Software Engineer',
    }
  }
}

// ========================================
// 2. LOCAL QUESTION GENERATION (Question Bank)
// ========================================
export const generateQuestions = async (
  jobRole: string,
  difficulty?: string
): Promise<Question[]> => {
  console.log(
    `🎯 Generating questions for: ${jobRole} (${
      difficulty || 'mixed'
    } difficulty)`
  )

  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 📚 Comprehensive Question Bank
    const questionBank: Record<string, Question[]> = {
      'Frontend Developer': [
        {
          id: 'fe-1',
          text: 'What is the difference between let, const, and var in JavaScript?',
          difficulty: 'Easy' as const,
          timeLimit: 300,
          category: 'JavaScript Fundamentals',
        },
        {
          id: 'fe-2',
          text: 'Explain the concept of closures in JavaScript with a practical example.',
          difficulty: 'Medium' as const,
          timeLimit: 480,
          category: 'JavaScript Advanced',
        },
        {
          id: 'fe-3',
          text: 'How would you optimize the performance of a React application?',
          difficulty: 'Hard' as const,
          timeLimit: 600,
          category: 'React Performance',
        },
        {
          id: 'fe-4',
          text: 'What is the CSS box model and how does it work?',
          difficulty: 'Easy' as const,
          timeLimit: 300,
          category: 'CSS Fundamentals',
        },
        {
          id: 'fe-5',
          text: 'Explain the difference between useEffect and useLayoutEffect in React.',
          difficulty: 'Medium' as const,
          timeLimit: 420,
          category: 'React Hooks',
        },
      ],

      'Backend Developer': [
        {
          id: 'be-1',
          text: 'What is the difference between SQL and NoSQL databases?',
          difficulty: 'Easy' as const,
          timeLimit: 300,
          category: 'Database Fundamentals',
        },
        {
          id: 'be-2',
          text: 'Explain RESTful API design principles and best practices.',
          difficulty: 'Medium' as const,
          timeLimit: 480,
          category: 'API Design',
        },
        {
          id: 'be-3',
          text: 'How would you design a scalable microservices architecture?',
          difficulty: 'Hard' as const,
          timeLimit: 600,
          category: 'System Architecture',
        },
        {
          id: 'be-4',
          text: 'What is middleware in Express.js and how do you use it?',
          difficulty: 'Easy' as const,
          timeLimit: 300,
          category: 'Node.js',
        },
        {
          id: 'be-5',
          text: 'Explain database indexing and its impact on query performance.',
          difficulty: 'Medium' as const,
          timeLimit: 420,
          category: 'Database Performance',
        },
      ],

      'Software Engineer': [
        {
          id: 'se-1',
          text: 'What are the SOLID principles of object-oriented programming?',
          difficulty: 'Medium' as const,
          timeLimit: 480,
          category: 'OOP Principles',
        },
        {
          id: 'se-2',
          text: 'Explain Big O notation and analyze the time complexity of common algorithms.',
          difficulty: 'Medium' as const,
          timeLimit: 420,
          category: 'Algorithms & Complexity',
        },
        {
          id: 'se-3',
          text: 'How would you approach debugging a complex production issue?',
          difficulty: 'Hard' as const,
          timeLimit: 540,
          category: 'Problem Solving',
        },
        {
          id: 'se-4',
          text: 'What is version control and why is Git important in software development?',
          difficulty: 'Easy' as const,
          timeLimit: 300,
          category: 'Development Tools',
        },
        {
          id: 'se-5',
          text: 'Describe the software development lifecycle and different methodologies.',
          difficulty: 'Easy' as const,
          timeLimit: 360,
          category: 'Software Engineering',
        },
      ],
    }

    // Get questions for the specified role (fallback to Software Engineer)
    const questions = questionBank[jobRole] || questionBank['Software Engineer']

    // Filter by difficulty if specified
    let filteredQuestions = questions
    if (difficulty && difficulty !== 'mixed') {
      filteredQuestions = questions.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }

    console.log(
      `✅ Generated ${filteredQuestions.length} questions for ${jobRole}`
    )
    filteredQuestions.forEach((q) =>
      console.log(`  📝 ${q.difficulty}: ${q.text.substring(0, 50)}...`)
    )

    return filteredQuestions
  } catch (error) {
    console.error('❌ Error generating questions:', error)
    // Fallback questions
    return [
      {
        id: 'fallback-1',
        text: `Tell me about your experience with ${jobRole} responsibilities.`,
        difficulty: 'Medium' as const,
        timeLimit: 300,
        category: 'General Experience',
      },
    ]
  }
}

// ========================================
// 3. HEURISTIC ANSWER EVALUATION
// ========================================
export const evaluateAnswer = async (
  question: string,
  answer: string,
  difficulty: string = 'Medium'
): Promise<AnswerEvaluation> => {
  console.log('🔬 Starting heuristic answer evaluation...')
  console.log(`📋 Question: ${question.substring(0, 50)}...`)
  console.log(`📝 Answer length: ${answer.length} characters`)

  try {
    // Simulate evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    let score = 5 // Base score
    let feedback = ''

    // 🎯 Heuristic Scoring Algorithm

    // 1. Length-based scoring
    const answerLength = answer.trim().length
    if (answerLength < 20) {
      score += 0
      feedback += 'Answer is too brief. '
    } else if (answerLength < 100) {
      score += 1
      feedback += 'Answer could be more detailed. '
    } else if (answerLength < 300) {
      score += 2
      feedback += 'Good level of detail. '
    } else if (answerLength < 500) {
      score += 3
      feedback += 'Comprehensive answer. '
    } else {
      score += 2.5
      feedback += 'Very detailed response. '
    }

    // 2. Structure and quality indicators
    const hasExamples = /example|for instance|such as|like|consider/gi.test(
      answer
    )
    const hasExplanation = /because|since|due to|reason|explain/gi.test(answer)
    const hasTechnicalTerms =
      /function|method|algorithm|data|system|process|implement/gi.test(answer)

    if (hasExamples) {
      score += 1
      feedback += 'Includes good examples. '
    }

    if (hasExplanation) {
      score += 1
      feedback += 'Provides clear explanations. '
    }

    if (hasTechnicalTerms) {
      score += 0.5
      feedback += 'Uses appropriate technical language. '
    }

    // 3. Difficulty adjustment
    if (difficulty === 'Easy') {
      if (answerLength > 50) score += 0.5
    } else if (difficulty === 'Hard') {
      if (answerLength < 200) score -= 1
      else score += 1
    }

    // Clamp score between 0 and 10
    score = Math.max(0, Math.min(10, score))
    score = Math.round(score * 10) / 10 // Round to 1 decimal place

    // Generate final feedback
    if (score >= 8) {
      feedback =
        'Excellent answer! ' + feedback + 'Demonstrates strong understanding.'
    } else if (score >= 6) {
      feedback =
        'Good answer. ' +
        feedback +
        'Shows solid knowledge with room for improvement.'
    } else if (score >= 4) {
      feedback =
        'Adequate answer. ' +
        feedback +
        'Consider providing more depth and examples.'
    } else {
      feedback =
        'Answer needs improvement. ' +
        feedback +
        'Please provide more detailed explanations.'
    }

    const result = {
      score,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString(),
    }

    console.log(`✅ Evaluation completed: ${score}/10`)
    console.log(`💬 Feedback: ${feedback}`)

    return result
  } catch (error) {
    console.error('❌ Error in answer evaluation:', error)
    return {
      score: 5,
      feedback: 'Unable to evaluate answer properly. Please try again.',
      timestamp: new Date().toISOString(),
    }
  }
}

// ========================================
// 4. TEMPLATE-BASED SUMMARY GENERATION
// ========================================
export const generateSummary = async (
  answers: any[],
  candidateInfo: any
): Promise<FinalSummary> => {
  console.log('📊 Generating template-based interview summary...')
  console.log(`👤 Candidate: ${candidateInfo?.name || 'Unknown'}`)
  console.log(`💼 Role: ${candidateInfo?.jobRole || 'Unknown'}`)
  console.log(`📝 Total answers: ${answers.length}`)

  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Calculate overall score
    const scores = answers.map((a) => a.score || 0)
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const averageScore = answers.length > 0 ? totalScore / answers.length : 0
    const overallScore = Math.round(averageScore * 10) / 10

    // 🎯 Template-based feedback generation
    let feedback = ''
    let strengths: string[] = []
    let areasForImprovement: string[] = []
    let recommendation = ''

    // Performance categorization
    if (overallScore >= 8.5) {
      feedback = `Outstanding performance! ${
        candidateInfo?.name || 'The candidate'
      } demonstrated exceptional knowledge and communication skills throughout the ${
        candidateInfo?.jobRole || 'technical'
      } interview.`
      strengths = [
        'Excellent technical knowledge',
        'Clear and articulate communication',
        'Comprehensive understanding of concepts',
      ]
      areasForImprovement = ['Continue building on current expertise']
      recommendation = 'Highly Recommended'
    } else if (overallScore >= 7) {
      feedback = `Strong performance. ${
        candidateInfo?.name || 'The candidate'
      } showed solid understanding of ${
        candidateInfo?.jobRole || 'technical'
      } concepts with good communication skills.`
      strengths = [
        'Good technical foundation',
        'Effective communication',
        'Sound understanding of core concepts',
      ]
      areasForImprovement = [
        'Provide more detailed explanations',
        'Include more practical examples',
      ]
      recommendation = 'Recommended'
    } else if (overallScore >= 5.5) {
      feedback = `Satisfactory performance. ${
        candidateInfo?.name || 'The candidate'
      } demonstrated basic understanding but lacked depth in some areas.`
      strengths = ['Basic technical understanding', 'Willingness to learn']
      areasForImprovement = [
        'Develop deeper technical knowledge',
        'Practice explaining concepts clearly',
        'Gain more hands-on experience',
      ]
      recommendation = 'Maybe'
    } else {
      feedback = `Below expectations. ${
        candidateInfo?.name || 'The candidate'
      } showed limited understanding of key concepts.`
      strengths = ['Shows potential for growth']
      areasForImprovement = [
        'Significant technical skill development needed',
        'Study fundamental concepts thoroughly',
      ]
      recommendation = 'Not Recommended'
    }

    const result = {
      overallScore,
      totalQuestions: answers.length,
      feedback,
      strengths,
      areasForImprovement,
      recommendation,
      timestamp: new Date().toISOString(),
    }

    console.log('✅ Summary generation completed:')
    console.log(`📊 Overall Score: ${overallScore}/10`)
    console.log(`🎯 Recommendation: ${recommendation}`)

    return result
  } catch (error) {
    console.error('❌ Error generating summary:', error)

    // Fallback summary
    const fallbackScore =
      answers.length > 0
        ? answers.reduce((sum, a) => sum + (a.score || 0), 0) / answers.length
        : 5

    return {
      overallScore: Math.round(fallbackScore * 10) / 10,
      totalQuestions: answers.length,
      feedback: 'Interview completed successfully.',
      strengths: ['Participated in interview'],
      areasForImprovement: ['Continue development'],
      recommendation:
        fallbackScore >= 6 ? 'Consider for evaluation' : 'Needs improvement',
      timestamp: new Date().toISOString(),
    }
  }
}

console.log('🎉 Local AI Service initialized successfully!')
console.log(
  '🔧 Features: RegEx parsing, Question bank, Heuristic scoring, Template summaries'
)
