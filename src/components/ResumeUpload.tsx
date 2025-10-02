import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Upload, FileText, Loader2 } from 'lucide-react'
import * as api from '../services/api'
// Add PDF.js imports for real PDF reading
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

// Configure PDF.js worker - using CDN for reliability
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.js'

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
  const [manualText, setManualText] = useState('')
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file')

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
      let textContent = ''

      if (file.type.includes('pdf')) {
        // Real PDF reading implementation
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target!.result as ArrayBuffer)
            const pdf = await getDocument(data).promise
            textContent = ''

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const text = await page.getTextContent()
              textContent +=
                text.items.map((item: any) => item.str).join(' ') + '\n'
            }

            // Extract data using the real text content
            const extractedData = await api.extractResumeData(textContent)

            onResumeProcessed({
              ...extractedData,
              resumeText: textContent,
            })
          } catch (error) {
            console.error('Error processing PDF:', error)
            alert(
              'Error processing PDF. Please try again or use the text input method.'
            )
          } finally {
            setIsProcessing(false)
          }
        }
        reader.readAsArrayBuffer(file)
        return // Exit early since reader.onload handles the rest
      } else {
        // For DOCX files, provide instructions (no built-in browser support)
        textContent = `
          DOCX File Detected: ${file.name}
          
          For the best results, please:
          1. Open your Word document
          2. Select all text (Ctrl+A) and copy (Ctrl+C)  
          3. Click "Paste Text" button above
          4. Paste your resume content
          
          This ensures accurate text extraction and better AI analysis.
          
          File Details:
          - Name: ${file.name}
          - Size: ${(file.size / 1024).toFixed(2)} KB
          - Type: ${file.type}
        `

        // Extract data using the instructions
        const extractedData = await api.extractResumeData(textContent)

        onResumeProcessed({
          ...extractedData,
          resumeText: textContent,
        })
      }
    } catch (error) {
      console.error('Error processing resume:', error)
      alert(
        'Error processing resume. Please try again or try a different file.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualTextSubmit = async () => {
    if (!manualText.trim()) {
      alert('Please enter your resume text')
      return
    }

    setIsProcessing(true)

    try {
      const extractedData = await api.extractResumeData(manualText)

      onResumeProcessed({
        ...extractedData,
        resumeText: manualText,
      })
    } catch (error) {
      console.error('Error processing resume text:', error)
      alert('Error processing resume text. Please try again.')
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
          {/* Input method selection */}
          <div className="flex gap-2">
            <Button
              variant={inputMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setInputMethod('file')}
              className="flex-1"
              disabled={isProcessing}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={inputMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setInputMethod('text')}
              className="flex-1"
              disabled={isProcessing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Paste Text
            </Button>
          </div>

          {inputMethod === 'file' ? (
            <>
              {/* File upload section */}
              <div className="space-y-2">
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
            </>
          ) : (
            <>
              {/* Manual text input section */}
              <div className="space-y-2">
                <Label htmlFor="manual-text">Paste your resume text:</Label>
                <textarea
                  id="manual-text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleManualTextSubmit}
                  disabled={isProcessing || !manualText.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Analyze Resume Text'
                  )}
                </Button>
              </div>
            </>
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
