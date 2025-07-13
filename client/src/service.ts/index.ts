import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../constants";
import type { FileComparisonResponse, LoginFormType, LoginResponse, SignupFormType, SignupResponse } from "../types";
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
