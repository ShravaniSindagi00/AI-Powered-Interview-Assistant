import React, { useState, useEffect } from 'react'
import { CandidateList } from './CandidateList'
import { CandidateDetail } from './CandidateDetail'
import { Candidate } from '../types'
import * as api from '../services/api'

export function InterviewerTab() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Load candidates on mount and set up periodic refresh
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError('')
        const result = await api.getAllCandidates()
        setCandidates(result.data || [])
      } catch (error: any) {
        console.error('Error loading candidates:', error)
        setError(error.message || 'Failed to load candidates')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Refresh data every 10 seconds to catch updates
    const interval = setInterval(loadData, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleSelectCandidate = async (candidate: Candidate) => {
    try {
      setIsLoading(true)
      setError('')
      // Get full candidate details including questions and answers
      const result = await api.getCandidateDetails(candidate.id)
      setSelectedCandidate(result.data)
    } catch (error: any) {
      console.error('Error loading candidate details:', error)
      setError(error.message || 'Failed to load candidate details')
      // Fallback to using the basic candidate data
      setSelectedCandidate(candidate)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedCandidate(null)
  }

  if (selectedCandidate) {
    return (
      <div className="h-full overflow-auto p-6">
        <CandidateDetail candidate={selectedCandidate} onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">Loading candidates...</p>
        </div>
      )}

      <CandidateList
        candidates={candidates}
        onSelectCandidate={handleSelectCandidate}
        selectedCandidateId={
          selectedCandidate ? (selectedCandidate as Candidate).id : undefined
        }
      />
    </div>
  )
}
