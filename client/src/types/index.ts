/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ButtonProps } from "@mui/material";
import type { FocusEventHandler, ReactNode, RefObject } from 'react';
import type { ControllerRenderProps, FieldValues, ValidationRule } from 'react-hook-form';
import * as yup from 'yup';
import type { FIELD_TYPE } from "../constants";

 export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user?: User) => void;
  logout: () => void;
  loading: boolean;
}

export type ChildrenProps = {
  children: ReactNode;
};

export enum UserRoleEnum {
  RECRUITER = 'Recruiter',
  APPLICANT = 'Applicant',
}

export interface RoleBasedGuardProp extends ChildrenProps {
  roles?: UserRoleEnum[];
}

export interface NavButtonProps extends ButtonProps {
  to: string;
  label: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'select';
  label?: string;
  placeholder: string;
  options?: SelectOptions[];
}

export interface SecondaryButton {
  text: string;
  link: string;
}

export interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitButtonText: string;
  secondaryButton?: SecondaryButton;
  onSubmit: (data: any) => Promise<void>;
  validationSchema: yup.ObjectSchema<any>;
  isLoading?: boolean;
}

interface ControlLabelProps {
  controllerLabel: string;
  fieldType?: string;
  pattern?: ValidationRule<RegExp>;
  error?: string;
  isPassword?: boolean;
  isDisabled?: boolean;
}

export interface SelectOptions {
  value: string;
  name?: string;
  label?: string;
}

export interface CustomControlProps extends ControlLabelProps {
  controllerName: string;
  min?: string;
  maxLength?: number;
  readOnly?: boolean;
  rowsLength?: number;
  isPassword?: boolean;
  tooltipText?: string;
  isMultiLine?: boolean;
  canMultiSelect?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef?: RefObject<any>;
  defaultValue?: string | number | object;
  selectOptions?: SelectOptions[];
  blurOut?:
    | FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  dorpDownOpen?: boolean;
  isEmail?: boolean;
  isLockIcon?: boolean;
  placeholderString?: string;
  isContactInfo?: boolean;
  direction?: boolean;
  autoComplete?: string | undefined;
  isPortal?: boolean;
  maxFiles?: number;
}

export interface IShowPasswordProps {
  passwordType: string;
  isPassword: boolean | undefined;
  handleShowPassword: () => void;
}

export type PasswordType = FIELD_TYPE.password | FIELD_TYPE.text;

export interface TitleProp {
  title: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export interface SignupFormType {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface JobDescriptionEditorProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder?: string;
  disabled?: boolean;
}

export interface CompareFilesFormType {
  jobDescription: string;
  files: File[];
}

// File comparison types
export interface CVFeedback {
  skillsAlignment: string;
  experienceRelevance: string;
  educationFit: string;
  overallStrengths: string;
  areasForImprovement: string;
}


// File comparison types
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


export interface CompareFilesPayload{
  jobDescription: string;
  files: File[]; 
}

export interface Resume {
  id: number;
  fileUrl: string;
  fileType: string;
  attachableId: number;
  attachableType: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumeResponse {
  success: boolean;
  data: Resume[];
}