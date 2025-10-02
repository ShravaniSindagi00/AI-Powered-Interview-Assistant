import { Candidate, InterviewSession } from '../types';

const CANDIDATES_KEY = 'interview_candidates';
const SESSION_KEY = 'interview_session';

export const saveCandidates = (candidates: Candidate[]) => {
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
};

export const loadCandidates = (): Candidate[] => {
  const stored = localStorage.getItem(CANDIDATES_KEY);
  if (!stored) return [];
  
  try {
    const candidates = JSON.parse(stored);
    // Convert date strings back to Date objects
    return candidates.map((candidate: any) => ({
      ...candidate,
      createdAt: new Date(candidate.createdAt),
      completedAt: candidate.completedAt ? new Date(candidate.completedAt) : undefined,
      answers: candidate.answers.map((answer: any) => ({
        ...answer,
        answeredAt: new Date(answer.answeredAt)
      }))
    }));
  } catch {
    return [];
  }
};

export const saveSession = (session: InterviewSession | null) => {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...session,
      startedAt: session.startedAt.toISOString()
    }));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const loadSession = (): InterviewSession | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored);
    return {
      ...session,
      startedAt: new Date(session.startedAt)
    };
  } catch {
    return null;
  }
};

export const addCandidate = (candidate: Candidate) => {
  const candidates = loadCandidates();
  candidates.push(candidate);
  saveCandidates(candidates);
};

export const updateCandidate = (candidateId: string, updates: Partial<Candidate>) => {
  const candidates = loadCandidates();
  const index = candidates.findIndex(c => c.id === candidateId);
  if (index !== -1) {
    candidates[index] = { ...candidates[index], ...updates };
    saveCandidates(candidates);
  }
};