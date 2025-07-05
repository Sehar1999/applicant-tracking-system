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

  const onSuccess = (response: SignupResponse) => {
    const { success, message, data } = response ?? {};
    if (success) {
      const { accessToken, user } = data ?? {};
      setAuth(accessToken, user);
      enqueueSnackbar(message || "Account created successfully!", {
        variant: "success",
      });
      router.replace(ROUTES.main.dashboard);
    } else {
      enqueueSnackbar(message || "Signup failed", {
        variant: "error",
      });
    }
  };

  const onError = (error: Error) => {
    try {
      // Try to parse the error response
      const errorData = JSON.parse(error.message);
      enqueueSnackbar(errorData.message || "Signup failed", {
        variant: "error",
      });
    } catch {
      // Fallback error message
      enqueueSnackbar("Network error. Please try again.", {
        variant: "error",
      });
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
