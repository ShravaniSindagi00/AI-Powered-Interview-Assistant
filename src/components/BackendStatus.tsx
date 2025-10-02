// src/components/BackendStatus.tsx
import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { checkBackendHealth } from '../config/api'

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const connected = await checkBackendHealth()
      setIsConnected(connected)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isConnected === null && isChecking) {
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>Checking backend connection...</AlertDescription>
      </Alert>
    )
  }

  if (!isConnected) {
    return (
      <Alert variant="destructive" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          Cannot connect to backend server. Please ensure the backend is running
          on port 3001.
          <button
            onClick={checkConnection}
            className="ml-2 underline hover:no-underline"
            disabled={isChecking}
          >
            Retry
          </button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        Connected to backend server
      </AlertDescription>
    </Alert>
  )
}
