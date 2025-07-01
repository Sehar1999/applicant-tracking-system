import { useSnackbar } from "notistack";
import { LOGIN_FIELDS, ROUTES } from "../../constants";
import { useRouter } from "../../hooks/useRouter";
import { loginSchema } from "../../Schemas";
import type { LoginFormType } from "../../types";
import { useAuthStore } from "../../zustand/auth/store";
import { AuthFormContainer } from "./AuthFormContainer";
import { useLogin } from "../../service.ts";

export const LogIn = () => {
  const { replace } = useRouter();
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useLogin();
  const { enqueueSnackbar } = useSnackbar();

  const onSuccess = ({ access_token }: { access_token: string }) => {
    setAuth(access_token);
    replace(ROUTES.main.dashboard);
  };

  const onError = (error: Error) => {
    try {
      // Parse the error message which is a JSON string
      const errorData = JSON.parse(error.message);
      enqueueSnackbar(errorData.detail || "Failed to signup.", {
        variant: "error",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Fallback in case error is not in expected JSON format
      enqueueSnackbar("Failed to login", { variant: "error" });
    }
  };

  const handleSubmit = async ({ email, password }: LoginFormType) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    mutate(formData, { onSuccess, onError });
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
