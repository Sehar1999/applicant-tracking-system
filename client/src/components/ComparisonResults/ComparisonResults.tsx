import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import type { FileComparisonResponse } from "../../types";

interface ComparisonResultsProps {
  results: FileComparisonResponse;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results }) => {
  const { data } = results;

  if (!data) {
    return <Alert severity="error">No comparison data available</Alert>;
  }

  const { successfulFiles, failedFiles } = data;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Successful Files Analysis */}
      {successfulFiles.map((file) => (
        <Card key={file.id} elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {file.fileName}
              </Typography>
              <Chip
                label={`${file.score}% Match`}
                color={
                  file.score >= 70
                    ? "success"
                    : file.score >= 50
                    ? "warning"
                    : "error"
                }
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={file.score}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 3,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Skills Alignment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.feedback.skillsAlignment}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Experience Relevance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.feedback.experienceRelevance}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Education Fit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.feedback.educationFit}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="success.main"
                  gutterBottom
                >
                  Overall Strengths
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.feedback.overallStrengths}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="warning.main"
                  gutterBottom
                >
                  Areas for Improvement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.feedback.areasForImprovement}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Failed Files */}
      {failedFiles.map((file) => (
        <Alert key={file.fileName} severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{file.fileName}</strong> - Could not compare this file
          </Typography>
        </Alert>
      ))}

      {/* No Results */}
      {successfulFiles.length === 0 && failedFiles.length === 0 && (
        <Alert severity="info">
          No files were processed. Please try again.
        </Alert>
      )}
    </Box>
  );
};

export default ComparisonResults;
