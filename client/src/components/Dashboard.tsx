import { Box, Container, Typography, Button } from "@mui/material";
import { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import JobDescriptionEditor from "./JobDescriptionEditor";

export const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
  };

  const handleCompare = () => {
    console.log("uploaded files >>>uploaded files >>> ", uploadedFiles);
    console.log("job description  >>> ", jobDescription);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          <Typography variant="body1" color="text.secondary">
            Upload documents and create job descriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!uploadedFiles?.length || !jobDescription}
          onClick={handleCompare}
        >
          Compare
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: { xs: 1, md: "0 0 40%" } }}>
          <DocumentUpload
            files={uploadedFiles}
            onFilesChange={handleFilesChange}
            maxFiles={5}
          />
        </Box>

        <Box sx={{ flex: { xs: 1, md: "0 0 60%" } }}>
          <JobDescriptionEditor
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter a detailed job description..."
            // onGetPlainText={setPlainTextDescription}
          />
        </Box>
      </Box>
    </Container>
  );
};
