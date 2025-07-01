import { useCallback, useEffect, useState } from "react";

import { LoadingScreen } from "../components/LoadingScreen/LoadingScreen";
import { AUTH_LINKS } from "../constants";
import { useRouter } from "../hooks/useRouter";
import { useAuthStore } from "../zustand/auth/store";
import type { ChildrenProps } from "../types";

export const AuthGuard = ({ children }: ChildrenProps) => {
  const { loading } = useAuthStore();

  return loading ? <LoadingScreen /> : <Container>{children}</Container>;
};

const Container = ({ children }: ChildrenProps) => {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!isAuthenticated) {
      router.replace(AUTH_LINKS.SIGN_IN_LINK);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return children;
};
