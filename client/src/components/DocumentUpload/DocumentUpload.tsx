import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
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
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { dropzoneStyle } from "../../constants/StyledConstants";

interface DocumentUploadProps {
  field: ControllerRenderProps<FieldValues, string>;
  maxFiles?: number;
  disabled?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  field,
  maxFiles = 5,
  disabled = false,
}) => {
  const theme = useTheme();
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB
  const files = field.value || [];

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
        field.onChange(newFiles);
      }
    },
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_: File, i: number) => i !== index);
    field.onChange(newFiles);
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

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Upload PDF or DOCX files (max {maxFiles} file{maxFiles > 1 ? "s" : ""}
          , 50MB each)
        </Typography>
      </Box>

      {/* Dropzone */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          {...getRootProps()}
          sx={dropzoneStyle(theme, isDragReject, isDragActive, disabled)}
        >
          <input {...getInputProps()} />
          <CloudUpload
            sx={{
              fontSize: 40,
              color: isDragReject
                ? "#d32f2f"
                : isDragActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              mb: 1,
            }}
          />
          <Typography variant="body2" sx={{ mb: 1 }}>
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop files here, or click to browse"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
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

        {files.length >= maxFiles && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Maximum number of files reached ({maxFiles})
          </Alert>
        )}
      </Box>

      {/* File List */}
      {files.length > 0 && (
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Files ({files.length}/{maxFiles})
            </Typography>
          </Box>
          <List dense sx={{ p: 0 }}>
            {files.map((file: File, index: number) => (
              <ListItem
                key={`${file.name}-${index}`}
                sx={{
                  bgcolor: "white",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
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
    </Box>
  );
};

export default DocumentUpload;
