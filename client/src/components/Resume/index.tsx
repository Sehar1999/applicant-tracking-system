import { useEffect, useState } from "react";
import type { Resume, ResumeResponse } from "../../types";
import { useGetResumes } from "../../service.ts";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
  Paper,
} from "@mui/material";
import {
  Description as FileIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  InsertDriveFile as GenericFileIcon,
} from "@mui/icons-material";

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return <FileIcon color="error" />;
  if (type.includes("doc") || type.includes("docx"))
    return <FileIcon color="primary" />;
  if (type.includes("txt")) return <FileIcon color="action" />;
  return <GenericFileIcon color="action" />;
};

const getFileTypeColor = (
  fileType: string
): "error" | "primary" | "default" => {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "error";
  if (type.includes("doc") || type.includes("docx")) return "primary";
  if (type.includes("txt")) return "default";
  return "default";
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFileNameFromUrl = (fileUrl: string): string => {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    // Remove any query parameters and get the filename
    const fileName = lastPart.split("?")[0];
    // Remove timestamp prefix if present (format: timestamp-filename.ext)
    const parts = fileName.split("-");
    if (parts.length > 1) {
      // Check if first part is a timestamp (numeric)
      if (!isNaN(Number(parts[0]))) {
        return parts.slice(1).join("-");
      }
    }
    return fileName;
  } catch {
    return "Unknown file";
  }
};

const FileSkeleton = () => (
  <Card sx={{ height: 200, display: "flex", flexDirection: "column" }}>
    <CardContent
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="80%" height={16} />
      <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </Box>
    </CardContent>
  </Card>
);

export const ResumeList = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);

  const { data, isLoading, error } = useGetResumes();

  useEffect(() => {
    if (data) {
      const { data: resumeFiles } = data as ResumeResponse;
      if (resumeFiles?.length) setResumes(resumeFiles || []);
    }
  }, [data]);

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownloadFile = (fileUrl: string) => {
    // Simple approach - just open the Cloudinary URL directly
    window.open(fileUrl, "_blank");
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading resumes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        My Resumes
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <FileSkeleton key={index} />
            ))}
        </Box>
      ) : resumes.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <FileIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No resumes uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload your first resume to get started
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              sx={{
                height: 200,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  {getFileIcon(resume.fileType)}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {getFileNameFromUrl(resume.fileUrl)}
                  </Typography>
                </Box>

                <Chip
                  label={resume.fileType.toUpperCase()}
                  size="small"
                  color={getFileTypeColor(resume.fileType)}
                  sx={{ alignSelf: "flex-start" }}
                />

                <Typography variant="caption" color="text.secondary">
                  Uploaded: {formatDate(resume.uploadedAt)}
                </Typography>

                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Tooltip title="View file">
                    <IconButton
                      size="small"
                      onClick={() => handleViewFile(resume.fileUrl)}
                      sx={{
                        backgroundColor: "primary.light",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.main",
                        },
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download file">
                    <IconButton
                      size="small"
                      onClick={() => handleDownloadFile(resume.fileUrl)}
                      sx={{
                        backgroundColor: "success.light",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "success.main",
                        },
                        "&:disabled": {
                          backgroundColor: "grey.300",
                          color: "grey.500",
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
