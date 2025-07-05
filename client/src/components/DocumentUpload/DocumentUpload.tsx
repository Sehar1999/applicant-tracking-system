import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  useTheme,
} from "@mui/material";
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  Description,
} from "@mui/icons-material";

interface DocumentUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  disabled = false,
}) => {
  const theme = useTheme();
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles,
    maxSize: maxSizeBytes,
    disabled,
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      if (newFiles.length <= maxFiles) {
        onFilesChange(newFiles);
      }
    },
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <Description sx={{ color: "#d32f2f" }} />;
    }
    return <InsertDriveFile sx={{ color: theme.palette.primary.main }} />;
  };

  const dropzoneStyle = {
    border: `2px dashed ${
      isDragReject
        ? "#d32f2f"
        : isDragActive
        ? theme.palette.primary.main
        : theme.palette.divider
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center" as const,
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: isDragActive
      ? `${theme.palette.primary.main}08`
      : isDragReject
      ? "#ffebee"
      : theme.palette.background.default,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: disabled ? undefined : `${theme.palette.primary.main}04`,
    },
  };

  return (
    <Card elevation={1} sx={{ height: "fit-content" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Document Upload
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload PDF or DOCX files (max {maxFiles} files, 50MB each)
        </Typography>

        <Box {...getRootProps()} sx={dropzoneStyle}>
          <input {...getInputProps()} />
          <CloudUpload
            sx={{
              fontSize: 48,
              color: isDragReject
                ? "#d32f2f"
                : isDragActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              mb: 2,
            }}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop files here, or click to browse"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: PDF, DOCX
          </Typography>
        </Box>

        {fileRejections.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {fileRejections.map(({ file, errors }) => (
              <Typography key={file.name} variant="body2">
                {file.name}: {errors.map((e) => e.message).join(", ")}
              </Typography>
            ))}
          </Alert>
        )}

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Uploaded Files ({files.length}/{maxFiles})
            </Typography>
            <List dense>
              {files.map((file, index) => (
                <ListItem
                  key={`${file.name}-${index}`}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    mb: 1,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ mr: 2 }}>{getFileIcon(file.name)}</Box>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {files.length >= maxFiles && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Maximum number of files reached ({maxFiles})
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
