import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Candidate } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Clock, 
  Trophy, 
  ArrowLeft,
  Bot,
  MessageSquare 
} from 'lucide-react';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

export function CandidateDetail({ candidate, onBack }: CandidateDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const averageScore = candidate.answers.length > 0 
    ? candidate.answers.reduce((sum, answer) => sum + answer.score, 0) / candidate.answers.length 
    : 0;

  const totalTimeSpent = candidate.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Candidate Details</h1>
      </div>

      {/* Candidate Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.jobRole}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{candidate.jobRole}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Started: {formatDate(candidate.createdAt)}</span>
              </div>
              {candidate.completedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Completed: {formatDate(candidate.completedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-500" />
                <span>Total Time: {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(candidate.finalScore)}`}>
                {candidate.finalScore}/10
              </div>
              <p className="text-sm text-gray-600 mt-1">Final Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(averageScore * 10) / 10}/10
              </div>
              <p className="text-sm text-gray-600 mt-1">Average Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {candidate.answers.length}/{candidate.questions.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Questions Answered</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-2">AI Feedback</h4>
            <p className="text-gray-700 leading-relaxed">{candidate.finalFeedback}</p>
          </div>
        </CardContent>
      </Card>

      {/* Interview Chat History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interview Chat History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {candidate.questions.map((question, index) => {
              const answer = candidate.answers[index];
              return (
                <div key={question.id} className="space-y-3">
                  {/* Question */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-500">{question.category}</span>
                          <span className="text-sm text-gray-500">
                            {question.timeLimit}s limit
                          </span>
                        </div>
                        <p>{question.text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {answer ? (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="mb-3">{answer.text || 'No answer provided'}</p>
                          <div className="border-t pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                Score: <span className={`font-semibold ${getScoreColor(answer.score)}`}>
                                  {answer.score}/10
                                </span>
                              </span>
                              <span>Time: {answer.timeSpent}s / {question.timeLimit}s</span>
                            </div>
                            <p className="text-sm text-gray-600 italic">{answer.feedback}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-500 italic">Question not answered yet</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {index < candidate.questions.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}