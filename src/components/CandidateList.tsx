import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Candidate } from '../types';
import { User, Calendar, Trophy, Clock } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  selectedCandidateId?: string;
}

export function CandidateList({ candidates, onSelectCandidate, selectedCandidateId }: CandidateListProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 bg-green-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (candidate: Candidate) => {
    if (candidate.completedAt) {
      return <Badge variant="default">Completed</Badge>;
    }
    return <Badge variant="secondary">In Progress</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Sort candidates by final score (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.finalScore - a.finalScore);

  if (candidates.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
          <p className="text-gray-500">Candidates will appear here after completing interviews.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Candidates ({candidates.length})</h2>
        <div className="text-sm text-gray-500">
          Sorted by score (highest first)
        </div>
      </div>

      <div className="grid gap-4">
        {sortedCandidates.map((candidate, index) => (
          <Card 
            key={candidate.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCandidateId === candidate.id ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
            onClick={() => onSelectCandidate(candidate)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && candidate.completedAt && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className={`h-4 w-4 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-orange-600'
                        }`} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{candidate.name}</h3>
                      {getStatusBadge(candidate)}
                    </div>
                    <p className="text-sm text-gray-600">{candidate.jobRole}</p>
                    <p className="text-sm text-gray-500">{candidate.email}</p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.finalScore)}`}>
                    <Trophy className="h-3 w-3 mr-1" />
                    {candidate.finalScore}/10
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(candidate.createdAt)}
                    </div>
                    {candidate.completedAt && (
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        Completed {formatDate(candidate.completedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {candidate.answers.length}/{candidate.questions.length} questions answered
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}