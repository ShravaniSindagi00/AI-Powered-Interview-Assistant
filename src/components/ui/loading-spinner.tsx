// src/components/ui/loading-spinner.tsx
import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from './utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({
  className,
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
}

export function LoadingCard({
  title = 'Loading...',
  description,
}: LoadingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
      <LoadingSpinner size="lg" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600 text-center">{description}</p>
      )}
    </div>
  )
}
