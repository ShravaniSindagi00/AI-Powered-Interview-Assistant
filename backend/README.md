# Dynamic AI Interview Backend

## Phase 1: Basic Server & API Setup ✅ COMPLETED

This is the backend server for the Dynamic AI Interview Application. Phase 1 provides a working Express.js server with mock AI implementations that replace the frontend's localStorage-based mock functions.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the `.env` file and update the values as needed:

- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Your React app URL (default: http://localhost:5173)

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

- **GET** `/api/health`
- Returns server status and basic information

### AI Endpoints (Phase 1 - Mock Implementation)

#### Analyze Resume

- **POST** `/api/ai/analyze-resume`
- Body: `{ "resumeText": "string" }`
- Returns extracted candidate information

#### Generate Questions

- **POST** `/api/ai/generate-questions`
- Body: `{ "jobRole": "string" }`
- Returns interview questions for the specified role

#### Evaluate Answer

- **POST** `/api/ai/evaluate-answer`
- Body: `{ "question": "string", "answer": "string", "difficulty": "string" }`
- Returns score and feedback for the answer

#### Generate Summary

- **POST** `/api/ai/generate-summary`
- Body: `{ "answers": [...], "candidateInfo": {...} }`
- Returns overall interview summary and recommendation

## Current Implementation

Phase 1 includes:

- ✅ Express.js server setup
- ✅ CORS configuration for frontend communication
- ✅ Basic error handling and logging
- ✅ Health check endpoint
- ✅ Mock AI endpoints with placeholder logic
- ✅ Environment configuration

## Console Logging

All requests and responses are logged to the console for debugging:

- Request method and path
- Request body content
- Processing results
- Error information

## Next Phases

- **Phase 2**: Database integration for data persistence
- **Phase 3**: Real AI integration (Gemini API)
- **Phase 4**: Authentication and user management
- **Phase 5**: Advanced features and optimization
