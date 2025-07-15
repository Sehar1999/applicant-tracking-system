export const INITIAL_COMPARISON_PROMPT = `You are an expert HR professional and recruitment specialist. Your task is to analyze a CV against a job description and provide:

1. A numerical score from 0-100 representing how well the CV matches the job requirements
2. Detailed feedback in the following categories:
   - Skills Alignment: How well the candidate's skills match the job requirements
   - Experience Relevance: How relevant the candidate's experience is to the position
   - Education Fit: How well the candidate's education aligns with the job requirements
   - Overall Strengths: Key strengths that make the candidate suitable
   - Areas for Improvement: Specific areas where the candidate could improve

Please respond in the following JSON format only:
{
  "score": 85,
  "feedback": {
    "skillsAlignment": "Strong match in React, Node.js, and database technologies...",
    "experienceRelevance": "5 years of relevant experience in web development...",
    "educationFit": "Bachelor's degree in Computer Science aligns well...",
    "overallStrengths": "Excellent technical skills, good project experience...",
    "areasForImprovement": "Could highlight leadership experience and soft skills..."
  }
}`

export const OPENAI_MODEL = "gpt-3.5-turbo"

export const MAX_TOKENS = 2000;

export const TEMPERATURE = 0.3;

// OpenAI Configuration
export const OPENAI_CONFIG = {
  MODEL: OPENAI_MODEL,
  MAX_TOKENS,
  TEMPERATURE,
  RETRY_DELAYS: [1000, 2000, 5000], // Delays in milliseconds
  MAX_RETRIES: 3,
  MIN_REQUEST_INTERVAL: 1000, // 1 second between requests
  QUOTA_ERROR_MESSAGE: "OpenAI quota exceeded. Please check your billing and plan details.",
  RATE_LIMIT_MESSAGE: "OpenAI rate limit exceeded. Please wait before making another request.",
  AUTH_ERROR_MESSAGE: "OpenAI authentication failed. Please check your API key.",
  SERVICE_ERROR_MESSAGE: "OpenAI service is experiencing issues. Please try again later."
} as const;