import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../constants";
import { api } from "./fetcher";
import type { LoginResponse, SignupFormType, SignupResponse } from "../types";

export const useLogin = () =>
  useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post<LoginResponse>(endpoints.auth.login, formData);
    },
  });


export const useSignup = () =>
  useMutation({
    mutationFn: async (data: SignupFormType) => {
      return api.post<SignupResponse>(endpoints.auth.register, data);
    },
  });