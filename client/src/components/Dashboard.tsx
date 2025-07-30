import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { createCompareFilesSchema } from "../Schemas";
import { useCompareFiles } from "../service.ts";
import { CustomController } from "./CustomController";
import { useAuthStore } from "../zustand/auth/store";
import { UserRoleEnum, type FileComparisonResponse } from "../types";
import ComparisonResults from "./ComparisonResults/ComparisonResults.tsx";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const maxFiles = userRole === UserRoleEnum.RECRUITER ? 5 : 1;

  const [comparisonResults, setComparisonResults] = useState<
    import("../types").FileComparisonResponse | null
  >(null);

  const methods = useForm<{
    jobDescription: string;
    files: File[];
  }>({
    resolver: yupResolver(createCompareFilesSchema(userRole)),
    defaultValues: {
      jobDescription: "",
      files: [],
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const { mutate, isPending } = useCompareFiles();

  const onSubmit = (data: { jobDescription: string; files: File[] }) => {
    const payload = new FormData();
    payload.append("jobDescription", data.jobDescription);
    data.files.forEach((file: File) => {
      payload.append("files", file);
    });

    mutate(payload, {
      onSuccess: (data: FileComparisonResponse) => {
        setComparisonResults(data);
        enqueueSnackbar("Files compared successfully!", { variant: "success" });
      },
      onError: (error) => {
        console.error(error);
        enqueueSnackbar("Error comparing files", { variant: "error" });
      },
    });
  };

  const handleNewComparison = () => {
    setComparisonResults(null);
    reset();
  };

  const { jobDescription, files } = watch();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Upload documents and create job descriptions for comparison
          </Typography>
          <Alert severity="info" sx={{ mt: 2, maxWidth: 450 }}>
            {userRole === UserRoleEnum.RECRUITER
              ? "Recruiters can upload up to 5 files"
              : "Applicants can upload 1 file"}
          </Alert>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {comparisonResults ? (
            <Button variant="outlined" onClick={handleNewComparison}>
              New Comparison
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={isPending || !jobDescription || !files.length}
              onClick={handleSubmit(onSubmit)}
            >
              Compare
              {isPending && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Button>
          )}
        </Box>
      </Box>

      {!comparisonResults ? (
        <FormProvider {...methods}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: "column",
            }}
          >
            {/* Job Description - 65% */}
            <Box
              sx={{
                flex: { xs: 1, lg: "0 0 65%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Box sx={{ flex: 1 }}>
                <CustomController
                  controllerName="jobDescription"
                  controllerLabel=""
                  fieldType="jobDescription"
                  placeholderString="Enter job description..."
                  isDisabled={isPending}
                />
              </Box>
            </Box>

            {/* Document Upload - 35% */}
            <Box
              sx={{
                flex: { xs: 1, lg: "0 0 35%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Document Upload
              </Typography>
              <Box sx={{ flex: 1 }}>
                <CustomController
                  controllerName="files"
                  controllerLabel=""
                  fieldType="documentUpload"
                  maxFiles={maxFiles}
                  isDisabled={isPending}
                />
              </Box>
            </Box>
          </Box>
        </FormProvider>
      ) : (
        <ComparisonResults results={comparisonResults} />
      )}
    </Container>
  );
};
