import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  authFormCardStyle,
  authTitleStyle,
  authSubtitleStyle,
  enhancedButtonStyle,
  authSecondaryButtonStyle,
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

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    await onSubmit(data);
  };

  return (
    <Box sx={authFormCardStyle}>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography sx={authTitleStyle}>{title}</Typography>
            <Typography sx={authSubtitleStyle}>{subtitle}</Typography>
            <Divider
              sx={{
                mt: 2,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
                height: "2px",
                border: "none",
              }}
            />
          </Box>

          {/* Form Fields */}
          <Box sx={{ mb: 3 }}>
            {fields.map(
              ({ name, label, type, placeholder, options }, index) => (
                <Box
                  key={name}
                  sx={{
                    mb: 3,
                    transform: "translateY(10px)",
                    opacity: 0,
                    animation: `slideInUp 0.6s ease forwards ${index * 0.1}s`,
                    "@keyframes slideInUp": {
                      to: {
                        transform: "translateY(0)",
                        opacity: 1,
                      },
                    },
                  }}
                >
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
              )
            )}
          </Box>

          {/* Submit Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={enhancedButtonStyle}
              disabled={isLoading}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Processing...</span>
                </Box>
              ) : (
                submitButtonText
              )}
            </Button>
          </Box>

          {/* Secondary Action */}
          {secondaryButton && (
            <>
              <Divider
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)",
                  height: "1px",
                  border: "none",
                }}
              />
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="text"
                  sx={authSecondaryButtonStyle}
                  onClick={() => replace(secondaryButton.link)}
                >
                  {secondaryButton.text}
                </Button>
              </Box>
            </>
          )}

          {/* Trust Indicators */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid rgba(148, 163, 184, 0.2)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              🔒 Secured with enterprise-grade encryption
            </Typography>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};
