import { Question, Answer, Candidate } from '../types';

// Mock AI functions to simulate Gemini API responses
export const mockExtractResumeData = async (resumeText: string) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extraction - in real app, this would call Gemini API
  const emailMatch = resumeText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  // Simple job role inference based on keywords
  const jobRoleKeywords = {
    'Frontend Developer': ['react', 'javascript', 'html', 'css', 'frontend', 'ui'],
    'Backend Developer': ['node', 'python', 'java', 'backend', 'api', 'server'],
    'Full Stack Developer': ['fullstack', 'full-stack', 'full stack'],
    'Data Scientist': ['python', 'machine learning', 'data science', 'pandas', 'numpy'],
    'Product Manager': ['product', 'manager', 'strategy', 'roadmap'],
    'Software Engineer': ['software', 'engineer', 'programming', 'development']
  };
  
  let inferredRole = 'Software Engineer'; // default
  const resumeLower = resumeText.toLowerCase();
  
  for (const [role, keywords] of Object.entries(jobRoleKeywords)) {
    if (keywords.some(keyword => resumeLower.includes(keyword))) {
      inferredRole = role;
      break;
    }
  }
  
  return {
    name: '', // Will be manually filled
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    jobRole: inferredRole
  };
};

export const mockGenerateQuestions = async (jobRole: string): Promise<Question[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const questionBank = {
    'Frontend Developer': [
      { text: 'What is the difference between let, const, and var in JavaScript?', difficulty: 'Easy' as const, category: 'JavaScript Fundamentals' },
      { text: 'Explain the concept of closures in JavaScript with an example.', difficulty: 'Medium' as const, category: 'JavaScript Advanced' },
      { text: 'How would you optimize the performance of a React application?', difficulty: 'Hard' as const, category: 'React Performance' },
      { text: 'What is the box model in CSS?', difficulty: 'Easy' as const, category: 'CSS Fundamentals' },
      { text: 'Explain the difference between useEffect and useLayoutEffect.', difficulty: 'Medium' as const, category: 'React Hooks' },
      { text: 'Design a system for managing state in a large React application.', difficulty: 'Hard' as const, category: 'Architecture' }
    ],
    'Backend Developer': [
      { text: 'What is the difference between SQL and NoSQL databases?', difficulty: 'Easy' as const, category: 'Database' },
      { text: 'Explain how RESTful APIs work and their key principles.', difficulty: 'Medium' as const, category: 'API Design' },
      { text: 'How would you design a scalable microservices architecture?', difficulty: 'Hard' as const, category: 'System Design' },
      { text: 'What is middleware in Express.js?', difficulty: 'Easy' as const, category: 'Framework' },
      { text: 'Explain different types of database joins with examples.', difficulty: 'Medium' as const, category: 'Database Advanced' },
      { text: 'Design a distributed caching system for high-traffic applications.', difficulty: 'Hard' as const, category: 'Distributed Systems' }
    ],
    'Software Engineer': [
      { text: 'What is time complexity and how do you calculate it?', difficulty: 'Easy' as const, category: 'Algorithms' },
      { text: 'Explain the difference between stack and heap memory.', difficulty: 'Medium' as const, category: 'Computer Science' },
      { text: 'Design a system to handle 1 million concurrent users.', difficulty: 'Hard' as const, category: 'System Design' },
      { text: 'What are the SOLID principles in software engineering?', difficulty: 'Easy' as const, category: 'Design Principles' },
      { text: 'How would you implement a thread-safe singleton pattern?', difficulty: 'Medium' as const, category: 'Design Patterns' },
      { text: 'Explain how you would design a chat application like WhatsApp.', difficulty: 'Hard' as const, category: 'System Architecture' }
    ]
  };
  
  const questions = questionBank[jobRole as keyof typeof questionBank] || questionBank['Software Engineer'];
  
  // Select 2 easy, 2 medium, 2 hard
  const easyQuestions = questions.filter(q => q.difficulty === 'Easy').slice(0, 2);
  const mediumQuestions = questions.filter(q => q.difficulty === 'Medium').slice(0, 2);
  const hardQuestions = questions.filter(q => q.difficulty === 'Hard').slice(0, 2);
  
  const selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  
  return selectedQuestions.map((q, index) => ({
    id: `q-${Date.now()}-${index}`,
    text: q.text,
    difficulty: q.difficulty,
    timeLimit: q.difficulty === 'Easy' ? 20 : q.difficulty === 'Medium' ? 60 : 120,
    category: q.category
  }));
};

export const mockEvaluateAnswer = async (question: Question, answer: string): Promise<{score: number, feedback: string}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock evaluation logic
  const answerLength = answer.trim().length;
  let baseScore = 0;
  
  if (answerLength === 0) {
    return { score: 0, feedback: 'No answer provided.' };
  }
  
  // Score based on answer length and question difficulty
  if (question.difficulty === 'Easy') {
    baseScore = Math.min(10, Math.max(3, Math.floor(answerLength / 20)));
  } else if (question.difficulty === 'Medium') {
    baseScore = Math.min(10, Math.max(2, Math.floor(answerLength / 30)));
  } else {
    baseScore = Math.min(10, Math.max(1, Math.floor(answerLength / 40)));
  }
  
  // Add some randomness to make it feel more realistic
  const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  const finalScore = Math.max(0, Math.min(10, baseScore + variation));
  
  const feedbackOptions = {
    high: [
      'Excellent answer! Shows deep understanding of the concept.',
      'Great response with good technical details.',
      'Well-structured answer covering key points.'
    ],
    medium: [
      'Good answer but could use more detail.',
      'Correct approach, consider adding examples.',
      'Shows understanding but lacks depth in explanation.'
    ],
    low: [
      'Basic answer, needs more technical depth.',
      'Consider providing more specific examples.',
      'Answer is on track but requires more elaboration.'
    ]
  };
  
  let feedbackCategory = 'low';
  if (finalScore >= 7) feedbackCategory = 'high';
  else if (finalScore >= 4) feedbackCategory = 'medium';
  
  const feedback = feedbackOptions[feedbackCategory as keyof typeof feedbackOptions][
    Math.floor(Math.random() * feedbackOptions[feedbackCategory as keyof typeof feedbackOptions].length)
  ];
  
  return { score: finalScore, feedback };
};

export const mockGenerateFinalFeedback = async (candidate: Candidate): Promise<{score: number, feedback: string}> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const totalScore = candidate.answers.reduce((sum, answer) => sum + answer.score, 0);
  const averageScore = candidate.answers.length > 0 ? totalScore / candidate.answers.length : 0;
  const finalScore = Math.round(averageScore * 10) / 10; // Round to 1 decimal
  
  let feedback = '';
  
  if (finalScore >= 8) {
    feedback = `Excellent performance! ${candidate.name} demonstrated strong technical knowledge across all question categories. Highly recommended for the ${candidate.jobRole} position.`;
  } else if (finalScore >= 6) {
    feedback = `Good performance overall. ${candidate.name} shows solid understanding of key concepts with room for improvement in some areas. Would be a good fit for the ${candidate.jobRole} role.`;
  } else if (finalScore >= 4) {
    feedback = `Average performance. ${candidate.name} has basic understanding but needs development in several technical areas before being ready for the ${candidate.jobRole} position.`;
  } else {
    feedback = `Below average performance. ${candidate.name} would benefit from additional training and experience before being considered for the ${candidate.jobRole} role.`;
  }
  
  return { score: finalScore, feedback };
};