# Server - Applicant Tracking System

# ATS Server Setup

## Prerequisites
- Node.js installed
- PostgreSQL installed and running

## Setup Instructions

1. Clone the repository
2. Navigate to server directory: `cd server`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your database credentials
5. Set up the database: `npm run db:setup`
6. Start the development server: `npm run dev`

## Available Scripts

- `npm run db:setup` - Creates database, runs migrations and seeds
- `npm run db:reset` - Resets database (drops all tables and recreates)
- `npm run db:fresh` - Completely fresh database (drops database and recreates)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## For Development
Just run: `npm run db:setup` once, then `npm run dev`

## CV-JD Comparison API Flow

### How the Comparison API Works

The CV-JD comparison feature provides intelligent analysis of candidate resumes against job descriptions using OpenAI's GPT-3.5-turbo model. Here's the complete flow:

#### 1. **File Upload & Processing**
- **Endpoint**: `POST /api/files/compare`
- **Input**: Multiple CV files (PDF/Word) + Job Description
- **File Limit**: Maximum 5 files per request
- **File Types**: PDF, DOC, DOCX

#### 2. **Parallel Processing Pipeline**
For each uploaded CV file, the system processes in parallel:

1. **File Parsing**: Extract text content from PDF/Word documents
2. **Cloud Storage**: Upload files to Cloudinary for permanent storage
3. **Database Storage**: Save file metadata to PostgreSQL
4. **AI Analysis**: Send CV content + Job Description to OpenAI for comparison
5. **Result Compilation**: Combine all results into a single response

#### 3. **OpenAI Integration**
- **Model**: GPT-3.5-turbo
- **Processing**: 5 concurrent API calls (one per file)
- **Response Time**: ~2-5 seconds total (parallel processing)
- **Output**: Score (0-100%) + Structured feedback

#### 4. **Analysis Categories**
Each CV receives analysis in these areas:
- **Skills Alignment**: Technical and soft skills match
- **Experience Relevance**: Work experience relevance to the role
- **Education Fit**: Educational background alignment
- **Overall Strengths**: Key candidate advantages
- **Areas for Improvement**: Specific improvement suggestions

#### 5. **Response Structure**
```json
{
  "success": true,
  "message": "Job is done",
  "data": {
    "filesProcessed": 3,
    "totalFiles": 3,
    "successfulFiles": [
      {
        "id": 123,
        "fileName": "john-doe-cv.pdf",
        "fileUrl": "https://cloudinary.com/...",
        "score": 85,
        "feedback": {
          "skillsAlignment": "Strong match in React, Node.js...",
          "experienceRelevance": "5 years relevant experience...",
          "educationFit": "Bachelor's degree matches requirements...",
          "overallStrengths": "Excellent technical skills...",
          "areasForImprovement": "Could highlight leadership experience..."
        }
      }
    ],
    "failedFiles": [],
    "jobDescription": "We are looking for a Senior React Developer..."
  }
}
```

#### 6. **Error Handling**
- **Partial Failures**: If 1 file fails, others still process successfully
- **OpenAI Failures**: Graceful fallback with error messages
- **File Validation**: Invalid file types are rejected before processing
- **Rate Limiting**: Built-in protection against excessive requests

#### 7. **Performance Optimization**
- **Concurrent Processing**: All files processed simultaneously
- **No Caching**: Fresh analysis for each request
- **Efficient Parsing**: Optimized text extraction from documents
- **Streaming Uploads**: Direct file processing without temporary storage

#### 8. **Security Features**
- **Authentication Required**: JWT token validation
- **File Type Validation**: Only allowed document types
- **Size Limits**: 50MB maximum file size
- **User Isolation**: Users can only access their own files

### Environment Variables Required
```
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Cloudinary Configuration  
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ats_db
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
```



## OpenAI Integration

This server includes OpenAI integration for CV analysis and comparison with job descriptions.

### Configuration

The OpenAI integration is configured in `src/constants/index.ts` with the following settings:

- **Model**: `gpt-3.5-turbo` (configurable)
- **Max Tokens**: 1000
- **Temperature**: 0.3 (for consistent results)
- **Retry Delays**: [1000ms, 2000ms, 5000ms]
- **Max Retries**: 3
- **Rate Limiting**: 1 second between requests

### Environment Variables

Make sure to set your OpenAI API key in your `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Error Handling

The system now includes comprehensive error handling for various OpenAI scenarios:

1. **Quota Exceeded (429 - insufficient_quota)**: 
   - No retries (quota won't reset with retries)
   - Returns informative error message
   - Logs the issue for debugging

2. **Rate Limit Exceeded (429 - rate_limit)**:
   - Automatic retries with exponential backoff
   - Built-in rate limiting (1 second between requests)

3. **Authentication Errors (401)**:
   - No retries (authentication won't fix with retries)
   - Clear error message about API key issues

4. **Server Errors (5xx)**:
   - Automatic retries with delays
   - Graceful fallback responses

### API Endpoints

#### Check OpenAI Status
```
GET /api/files/openai-status
```
Use this endpoint to check if your OpenAI integration is working properly and if you have quota issues.

Response examples:
```json
// Success
{
  "success": true,
  "message": "OpenAI connection successful",
  "models": 67
}

// Quota Exceeded
{
  "success": false,
  "message": "OpenAI quota exceeded",
  "error": "insufficient_quota",
  "details": "You have exceeded your current quota. Please check your plan and billing details."
}
```

#### Compare Files
```
POST /api/files/compare
```
This endpoint will now handle quota issues gracefully and return informative error messages instead of crashing.

### Troubleshooting Quota Issues

If you're getting 429 "insufficient_quota" errors:

1. **Check your OpenAI billing**: Visit https://platform.openai.com/account/billing
2. **Verify your plan**: Ensure you have sufficient credits or a paid plan
3. **Check usage**: Monitor your API usage in the OpenAI dashboard
4. **Use the status endpoint**: Call `/api/files/openai-status` to get detailed error information

### Rate Limiting

The system includes built-in rate limiting to prevent hitting OpenAI's rate limits:
- Minimum 1 second between requests
- Automatic retry logic for transient errors
- Exponential backoff for retries

### Fallback Behavior

When OpenAI is unavailable, the system returns a fallback response with:
- Score: 0
- Informative error messages in each feedback category
- Clear indication of what went wrong

This ensures your application continues to function even when OpenAI is having issues. 