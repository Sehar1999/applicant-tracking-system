import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createCompareFilesSchema } from "../Schemas";
import { useCompareFiles } from "../service.ts";
import { CustomController } from "./CustomController";
import { FileSelection } from "./FileSelection";
import { useAuthStore } from "../zustand/auth/store";
import { UserRoleEnum, type FileComparisonResponse } from "../types";
import { API_BASE_URL, endpoints, ROUTES } from "../constants";
import ComparisonResults from "./ComparisonResults/ComparisonResults.tsx";

interface JobDescription {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const Dashboard = () => {
  const { user, accessToken } = useAuthStore();
  const userRole = user?.role;
  const maxFiles = userRole === UserRoleEnum.RECRUITER ? 5 : 1;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const jdId = searchParams.get('jdId');

  const [comparisonResults, setComparisonResults] = useState<
    import("../types").FileComparisonResponse | null
  >(null);
  
  const [selectedJobDescription, setSelectedJobDescription] = useState<JobDescription | null>(null);
  const [loadingJD, setLoadingJD] = useState(false);
  const [jdError, setJdError] = useState<string | null>(null);

  const methods = useForm<{
    jobDescription?: string;
    jobDescriptionId?: number;
    fileIds?: number[];
    files?: File[];
  }>({
    resolver: yupResolver(createCompareFilesSchema(userRole)),
    defaultValues: {
      jobDescription: "",
      fileIds: [],
      files: [],
    },
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const { mutate, isPending } = useCompareFiles();

  // Fetch job description when jdId is present
  useEffect(() => {
    const fetchJobDescription = async () => {
      if (!jdId || !accessToken) return;
      
      try {
        setLoadingJD(true);
        setJdError(null);
        
        const response = await fetch(`${API_BASE_URL}${endpoints.jobs.getById}/${jdId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (data.success && data.data) {
          setSelectedJobDescription(data.data);
          // Set the jobDescriptionId in the form when we have a selected JD
          setValue('jobDescriptionId', data.data.id);
        } else {
          setJdError(data.message || 'Failed to fetch job description');
        }
      } catch (error) {
        console.error('Error fetching job description:', error);
        setJdError('Failed to load job description');
      } finally {
        setLoadingJD(false);
      }
    };

    fetchJobDescription();
  }, [jdId, accessToken]);

  const onSubmit = (data: { jobDescription?: string; jobDescriptionId?: number; fileIds?: number[]; files?: File[] }) => {
    const payload = new FormData();
    
    // If we have a selected job description (from jdId), send the ID
    if (selectedJobDescription) {
      payload.append("jobDescriptionId", selectedJobDescription.id.toString());
    } else {
      // Otherwise, send the job description text
      payload.append("jobDescription", data.jobDescription || "");
    }
    
    // Add file IDs if any are selected
    if (data.fileIds && data.fileIds.length > 0) {
      data.fileIds.forEach((fileId: number) => {
        payload.append("fileIds", fileId.toString());
      });
    }
    
    // Add new files if any are uploaded
    if (data.files && data.files.length > 0) {
      data.files.forEach((file: File) => {
        payload.append("files", file);
      });
    }

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
    setSelectedJobDescription(null);
    // Clear the jdId from URL
    navigate(ROUTES.main.dashboard, { replace: true });
    reset();
    setValue('jobDescriptionId', undefined);
    setValue('fileIds', []);
    setValue('files', []);
  };

  const handleBackToJobs = () => {
    navigate(ROUTES.main.jobs);
  };

  const { jobDescription, fileIds, files } = watch();
  
  // Determine if we should show the comparison button
  const totalFiles = (fileIds?.length || 0) + (files?.length || 0);
  const canCompare = selectedJobDescription ? totalFiles > 0 : (jobDescription && totalFiles > 0);

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
          {comparisonResults && (
            <Button variant="outlined" onClick={handleNewComparison}>
              New Comparison
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Job Description
                </Typography>
                {selectedJobDescription && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleBackToJobs}
                    sx={{ textTransform: 'none' }}
                  >
                    ← Back to Jobs
                  </Button>
                )}
              </Box>
              
              {loadingJD ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : jdError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {jdError}
                </Alert>
              ) : selectedJobDescription ? (
                // Read-only mode for selected job description
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label="Using Saved Job Description" 
                        color="primary" 
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Chip 
                        label={`Created ${new Date(selectedJobDescription.createdAt).toLocaleDateString()}`}
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        maxHeight: 300,
                        overflow: 'auto',
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {selectedJobDescription.description}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                // Editable mode for new job descriptions
                <Box sx={{ flex: 1 }}>
                  <CustomController
                    controllerName="jobDescription"
                    controllerLabel=""
                    fieldType="jobDescription"
                    placeholderString="Enter job description..."
                    isDisabled={isPending}
                  />
                </Box>
              )}
            </Box>

            {/* Document Upload - 35% */}
            <Box
              sx={{
                flex: { xs: 1, lg: "0 0 35%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <FileSelection
                  selectedFileIds={fileIds || []}
                  onFileIdsChange={(newFileIds) => setValue('fileIds', newFileIds)}
                  selectedFiles={files || []}
                  onFilesChange={(newFiles) => setValue('files', newFiles)}
                  maxFiles={maxFiles}
                  isDisabled={isPending}
                />
              </Box>
            </Box>
          </Box>

          {!comparisonResults && <Box display='flex' justifyContent='flex-end' width='100%' mt='2rem'>
            <Button
              variant="contained"
              disabled={isPending || !canCompare}
              onClick={handleSubmit(onSubmit)}
            >
              Compare
              {isPending && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        }        </FormProvider>
      ) : (
        <ComparisonResults results={comparisonResults} />
      )}
    </Container>
  );
};
