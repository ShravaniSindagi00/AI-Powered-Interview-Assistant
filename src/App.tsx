import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { IntervieweeTab } from './components/IntervieweeTab'
import { InterviewerTab } from './components/InterviewerTab'
import { BackendStatus } from './components/BackendStatus'
import { Users, UserCheck } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('interviewee')

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Interview Platform
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent interviewing powered by AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="bg-white border-b px-6">
            <div className="max-w-7xl mx-auto">
              <TabsList className="grid w-full max-w-md grid-cols-2 mt-4">
                <TabsTrigger
                  value="interviewee"
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Interviewee
                </TabsTrigger>
                <TabsTrigger
                  value="interviewer"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Interviewer
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="interviewee" className="h-full m-0">
              <div className="h-full p-6">
                <BackendStatus />
                <div className="h-full">
                  <IntervieweeTab />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interviewer" className="h-full m-0">
              <div className="h-full p-6">
                <BackendStatus />
                <div className="h-full">
                  <InterviewerTab />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
