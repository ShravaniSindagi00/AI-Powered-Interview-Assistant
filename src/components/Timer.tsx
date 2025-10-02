import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Progress } from './ui/progress';

interface TimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  initialTime?: number;
}

export function Timer({ timeLimit, onTimeUp, isActive, initialTime }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime || timeLimit);

  useEffect(() => {
    if (initialTime !== undefined) {
      setTimeRemaining(initialTime);
    }
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${isLowTime ? 'text-red-500' : 'text-gray-500'}`} />
          <span className={`font-mono ${isLowTime ? 'text-red-500' : 'text-gray-600'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          / {formatTime(timeLimit)}
        </span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2"
        data-low-time={isLowTime}
      />
      {isLowTime && timeRemaining > 0 && (
        <p className="text-sm text-red-500 animate-pulse">
          Time running out!
        </p>
      )}
    </div>
  );
}