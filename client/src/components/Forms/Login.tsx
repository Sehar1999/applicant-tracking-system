import { useSnackbar } from "notistack";
import { LOGIN_FIELDS, ROUTES } from "../../constants";
import { useRouter } from "../../hooks/useRouter";
import { loginSchema } from "../../Schemas";
import type { LoginFormType, LoginResponse } from "../../types";
import { useAuthStore } from "../../zustand/auth/store";
import { AuthFormContainer } from "./AuthFormContainer";
import { useLogin } from "../../service.ts";

export const LogIn = () => {
  const { replace } = useRouter();
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useLogin();
  const { enqueueSnackbar } = useSnackbar();

  const onSuccess = (response: LoginResponse) => {
    const { success, message, data } = response ?? {};
    if (success) {
      const { accessToken, user } = data ?? {};
      setAuth(accessToken, user);
      enqueueSnackbar(message || "Login successful!", {
        variant: "success",
      });
      replace(ROUTES.main.dashboard);
    } else {
      enqueueSnackbar(message || "Login failed", {
        variant: "error",
      });
    }
  };

  const onError = (error: Error) => {
    try {
      // Try to parse the error response
      const errorData = JSON.parse(error.message);
      enqueueSnackbar(errorData.message || "Login failed", {
        variant: "error",
      });
    } catch {
      // Fallback error message
      enqueueSnackbar("Network error. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleSubmit = async ({ email, password }: LoginFormType) => {
    mutate({ email, password }, { onSuccess, onError });
  };

  const {
    auth: { main, register },
  } = ROUTES;

  return (
    <AuthFormContainer
      title="Login"
      subtitle="Login to your account"
      fields={LOGIN_FIELDS}
      submitButtonText="Login"
      secondaryButton={{
        text: "Don't have an account? Sign up",
        link: `${main}/${register}`,
      }}
      onSubmit={handleSubmit}
      validationSchema={loginSchema}
      isLoading={isPending}
    />
  );
};
