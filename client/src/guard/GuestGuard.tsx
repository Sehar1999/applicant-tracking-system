import { useCallback, useEffect, useState } from "react";
import { LoadingScreen } from "../components/LoadingScreen/LoadingScreen";
import { ROUTES } from "../constants";
import { useRouter } from "../hooks/useRouter";
import type { ChildrenProps } from "../types";
import { useAuthStore } from "../zustand/auth/store";

export const GuestGuard = ({ children }: ChildrenProps) => {
  const { loading } = useAuthStore();

  return loading ? <LoadingScreen /> : <Container>{children}</Container>;
};

const Container = ({ children }: ChildrenProps) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const returnTo = ROUTES.main.dashboard;
  const { isAuthenticated } = useAuthStore();

  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(returnTo);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return children;
};
