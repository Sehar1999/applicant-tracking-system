import { useCallback, useEffect } from "react";
import { AUTH_LINKS } from "../constants";
// import { useFetchCurrentUser } from "../utils/api";
import { useAuthStore } from "../zustand/auth/store";
import type { ChildrenProps } from "../types";
import { useRouter } from "../hooks/useRouter";
import { isValidToken } from "../utils";

export const AuthProvider = ({ children }: ChildrenProps) => {
  const { setAuth, logout, accessToken } = useAuthStore();
  const { replace } = useRouter();

  //   const {
  //     data: userData,
  //     error,
  //     isLoading,
  //   } = useFetchCurrentUser(Boolean(accessToken) && !user);

  const userData = null;
  const error = null;
  const isLoading = false;

  const initializeAuth = useCallback(async () => {
    if (userData && accessToken) {
      setAuth(accessToken, userData);
    } else if (error || !accessToken || !isValidToken(accessToken)) {
      logout();
      replace(AUTH_LINKS.SIGN_IN_LINK);
    }
  }, [userData, accessToken, error, setAuth, logout, replace]);

  useEffect(() => {
    if (!isLoading) {
      initializeAuth();
    }
  }, [initializeAuth, isLoading]);

  return children;
};
