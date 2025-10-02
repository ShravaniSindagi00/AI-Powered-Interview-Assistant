import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Upload, FileText, Loader2 } from 'lucide-react'
import * as api from '../services/api'

interface ResumeUploadProps {
  onResumeProcessed: (data: {
    name: string
    email: string
    phone: string
    jobRole: string
    resumeText: string
  }) => void
}

export function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      alert('Please upload a PDF or DOCX file')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      // Simulate reading file content (in real app, you'd use a PDF/DOCX parser)
      const mockResumeText = `
        John Doe
        Software Engineer
        john.doe@email.com
        +1 (555) 123-4567
        
        Experience:
        - 5 years of experience in React and JavaScript development
        - Built scalable frontend applications
        - Worked with REST APIs and modern development tools
        
        Skills:
        - React, JavaScript, TypeScript, HTML, CSS
        - Node.js, Express.js
        - Git, Docker, AWS
        
        Education:
        - Bachelor's in Computer Science
      `

      const extractedData = await api.extractResumeData(mockResumeText)

      onResumeProcessed({
        ...extractedData,
        resumeText: mockResumeText,
      })
    } catch (error) {
      console.error('Error processing resume:', error)
      alert('Error processing resume. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <Label htmlFor="resume-upload" className="cursor-pointer">
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <Button variant="outline" disabled={isProcessing} asChild>
                <span>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Choose PDF or DOCX file'
                  )}
                </span>
              </Button>
            </Label>
          </div>

          {uploadedFile && (
            <div className="text-sm text-gray-600 text-center">
              Selected: {uploadedFile.name}
            </div>
          )}

          {isProcessing && (
            <div className="text-sm text-blue-600 text-center">
              AI is analyzing your resume...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
