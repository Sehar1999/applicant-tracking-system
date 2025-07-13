import OpenAI from 'openai';
import { INITIAL_COMPARISON_PROMPT, MAX_TOKENS, OPENAI_MODEL, TEMPERATURE } from '../constants';
import { CVComparisonResult } from '../types';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI client with dummy key (will be replaced with actual key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-now',
});

const getPrompt = (cvContent: string, jobDescription: string) => `${INITIAL_COMPARISON_PROMPT}
CV Content:
${cvContent}

Job Description:
${jobDescription}

Analysis:`

export const compareCVWithJD = async (
  cvContent: string,
  jobDescription: string
): Promise<CVComparisonResult> => {
  try {
    const prompt = getPrompt(cvContent, jobDescription);

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: TEMPERATURE, // Lower temperature for more consistent results
      max_tokens: MAX_TOKENS,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const result = JSON.parse(response) as CVComparisonResult;
    
    // Validate the response structure
    if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
      throw new Error('Invalid score in OpenAI response');
    }

    if (!result.feedback || typeof result.feedback !== 'object') {
      throw new Error('Invalid feedback structure in OpenAI response');
    }

    return result;

  } catch (error) {
    console.error('OpenAI comparison error:', error);
    
    // Return a fallback response if OpenAI fails
    return {
      score: 0,
      feedback: {
        skillsAlignment: "Unable to analyze due to processing error",
        experienceRelevance: "Unable to analyze due to processing error",
        educationFit: "Unable to analyze due to processing error",
        overallStrengths: "Unable to analyze due to processing error",
        areasForImprovement: "Unable to analyze due to processing error"
      }
    };
  }
}; 