export enum UserRole {
  RECRUITER = 'Recruiter',
  APPLICANT = 'Applicant',
}

export interface JWTPayload {
  id: number;
  email: string;
  roleId: number;
}

// File comparison types
export interface CVFeedback {
  skillsAlignment: string;
  experienceRelevance: string;
  educationFit: string;
  overallStrengths: string;
  areasForImprovement: string;
}

export interface SuccessfulFile {
  id: number;
  fileName: string;
  fileUrl: string;
  score: number; // 0-100 percentage match
  feedback: CVFeedback;
}

export interface FailedFile {
  fileName: string;
  error: string;
}



export interface FileComparisonResponse {
  success: boolean;
  message: string;
  data?: {
    filesProcessed: number;
    totalFiles: number;
    successfulFiles: SuccessfulFile[];
    failedFiles: FailedFile[];
    jobDescription: string;
  };
} 


export interface CVComparisonResult {
  score: number;
  feedback: CVFeedback;
}