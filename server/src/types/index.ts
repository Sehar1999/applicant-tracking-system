export enum UserRole {
  RECRUITER = 'Recruiter',
  APPLICANT = 'Applicant',
}

export interface JWTPayload {
  id: number;
  email: string;
  roleId: number;
} 