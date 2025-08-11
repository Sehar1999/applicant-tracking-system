import { useMutation, useQuery } from "@tanstack/react-query";
import { endpoints } from "../constants";
import type { FileComparisonResponse, LoginFormType, LoginResponse, ProfilePictureResponse, ProfileUpdateFormType, ProfileUpdateResponse, ResumeResponse, SignupFormType, SignupResponse, FileSelectionResponse } from "../types";
import { api } from "./fetcher";

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginFormType) => {
      return api.post<LoginResponse>(endpoints.auth.login, data);
    },
  });


export const useSignup = () =>
  useMutation({
    mutationFn: async (data: SignupFormType) => {
      return api.post<SignupResponse>(endpoints.auth.register, data);
    },
  });

export const useCompareFiles = () =>
  useMutation({
    mutationFn: async (data: FormData) => {
      return api.post<FileComparisonResponse>(endpoints.files.compare, data);
    },
  });


export const useGetResumes = () =>
  useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      return api.get<ResumeResponse>(endpoints.files.myFiles);
    },
  });

export const useGetUserCVFiles = () =>
  useQuery({
    queryKey: ["user-cv-files"],
    queryFn: async () => {
      return api.get<FileSelectionResponse>(endpoints.files.myFiles);
    },
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (data: ProfileUpdateFormType) => {
      return api.put<ProfileUpdateResponse>(endpoints.auth.profile, data);
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return api.put<ProfileUpdateResponse>(endpoints.auth.profile, data);
    },
  });

export const useUpdateProfilePicture = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.put<ProfilePictureResponse>(endpoints.files.profilePicture, formData);
    },
  });