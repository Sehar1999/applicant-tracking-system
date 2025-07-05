import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../constants";
import { api } from "./fetcher";
import type { LoginFormType, LoginResponse, SignupFormType, SignupResponse } from "../types";

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