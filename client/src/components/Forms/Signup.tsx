import { useSnackbar } from "notistack";
import { AUTH_LINKS, ROUTES, SIGN_UP_FIELDS } from "../../constants";
import { useRouter } from "../../hooks/useRouter";
import { type SignupFormType, type SignupResponse } from "../../types";
import { useAuthStore } from "../../zustand/auth/store";
import { AuthFormContainer } from "./AuthFormContainer";
import { useSignup } from "../../service.ts";
import { signupSchema } from "../../Schemas/index.ts";

export const Signup = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useSignup();

  const onSuccess = ({ token: { access_token }, user }: SignupResponse) => {
    setAuth(access_token, user);
    router.replace(ROUTES.main.dashboard);
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
      enqueueSnackbar("Failed to signup", { variant: "error" });
    }
  };

  const handleSubmit = async (data: SignupFormType) => {
    mutate({ ...data }, { onSuccess, onError });
  };

  return (
    <AuthFormContainer
      title="Create Account"
      subtitle="Sign up to get started"
      fields={SIGN_UP_FIELDS}
      submitButtonText="Sign up"
      secondaryButton={{
        text: "Already have an account? Login",
        link: AUTH_LINKS.SIGN_IN_LINK,
      }}
      onSubmit={handleSubmit}
      validationSchema={signupSchema}
      isLoading={isPending}
    />
  );
};
