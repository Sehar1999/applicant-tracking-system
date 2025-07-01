import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  loadingButtonStyle,
  secondaryButtonStyle,
} from "../../constants/StyledConstants";
import { useRouter } from "../../hooks/useRouter";
import type { AuthFormProps } from "../../types";
import { CustomController } from "../CustomController";

export const AuthFormContainer = ({
  title,
  subtitle,
  fields,
  submitButtonText,
  secondaryButton,
  onSubmit,
  validationSchema,
  isLoading,
}: AuthFormProps) => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;

  const { replace } = useRouter();

  const handleFormSubmit = async (data: typeof validationSchema) =>
    await onSubmit(data);

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Box mb={3}>
          <Typography variant="h4" fontWeight={700} color="primary" mb={0.5}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {fields.map(({ name, label, type, placeholder, options }) => (
          <Box key={name} mb={2}>
            <CustomController
              controllerName={name}
              controllerLabel={label || ""}
              fieldType={type}
              isEmail={type === "email"}
              isPassword={type === "password"}
              placeholderString={placeholder}
              selectOptions={options}
            />
          </Box>
        ))}

        <Button
          type="submit"
          variant="contained"
          sx={loadingButtonStyle}
          disabled={isLoading}
        >
          {submitButtonText}{" "}
          {isLoading && (
            <CircularProgress sx={{ ml: 2, opacity: 0.5 }} size={20} />
          )}
        </Button>

        {secondaryButton && (
          <Box display="flex" justifyContent="flex-end" mb={2} mt={2}>
            <Button
              variant="text"
              color="primary"
              sx={secondaryButtonStyle}
              onClick={() => replace(secondaryButton.link)}
            >
              {secondaryButton.text}
            </Button>
          </Box>
        )}
      </Box>
    </FormProvider>
  );
};
