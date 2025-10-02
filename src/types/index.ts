export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobRole: string;
  resumeText: string;
  questions: Question[];
  answers: Answer[];
  finalScore: number;
  finalFeedback: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  text: string;
  score: number;
  feedback: string;
  timeSpent: number;
  answeredAt: Date;
}

export interface InterviewSession {
  candidateId: string;
  currentQuestionIndex: number;
  isActive: boolean;
  startedAt: Date;
  timeRemaining: number;
}