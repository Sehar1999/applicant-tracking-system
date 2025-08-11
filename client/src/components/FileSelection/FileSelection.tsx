import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useGetUserCVFiles } from '../../service.ts';
import type { FileSelectionItem } from '../../types';
import { useAuthStore } from '../../zustand/auth/store';
import { dropzoneStyle } from '../../constants/StyledConstants';
import { useTheme } from '@mui/material/styles';
import { getFileNameFromUrl } from '../../utils/index.tsx';

interface FileSelectionProps {
  selectedFileIds: number[];
  onFileIdsChange: (fileIds: number[]) => void;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles: number;
  isDisabled?: boolean;
}

export const FileSelection: React.FC<FileSelectionProps> = ({
  selectedFileIds,
  onFileIdsChange,
  selectedFiles,
  onFilesChange,
  maxFiles,
  isDisabled = false,
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { data: cvFilesResponse, isLoading, error } = useGetUserCVFiles();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cvFiles = cvFilesResponse?.data || [];
  const totalSelected = selectedFileIds.length + selectedFiles.length;

  // Get selected file details for display
  const selectedFileDetails = selectedFileIds.map(id => 
    cvFiles.find(file => file.id === id)
  ).filter(Boolean) as FileSelectionItem[];

  const handleFileIdChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    onFileIdsChange(value);
  };

  const handleRemoveFileId = (fileIdToRemove: number) => {
    onFileIdsChange(selectedFileIds.filter(id => id !== fileIdToRemove));
  };

  const handleChipDelete = (event: React.MouseEvent, fileIdToRemove: number) => {
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    handleRemoveFileId(fileIdToRemove);
  };

  const handleRemoveNewFile = (fileToRemove: File) => {
    onFilesChange(selectedFiles.filter(file => file !== fileToRemove));
  };

  const onDrop = (acceptedFiles: File[]) => {
    setUploadError(null);
    
    const newTotal = totalSelected + acceptedFiles.length;
    if (newTotal > maxFiles) {
      setUploadError(`You can only select up to ${maxFiles} files total`);
      return;
    }

    // Filter out duplicates
    const newFiles = acceptedFiles.filter(newFile => 
      !selectedFiles.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    );

    onFilesChange([...selectedFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    disabled: isDisabled,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load existing files. Please try again.
      </Alert>
    );
  }

  console.log('cvFiles >>> ', cvFiles);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select files for comparison
          </Typography>
          <Chip 
            label={`${totalSelected}/${maxFiles} files selected`}
            color={totalSelected > 0 ? "primary" : "default"}
            variant={totalSelected > 0 ? "filled" : "outlined"}
            size="small"
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Choose from existing files or upload new ones (max {maxFiles} total, 50MB each)
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Existing Files Selection */}
        {cvFiles.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              Select from Existing Files
            </Typography>
            
            <FormControl fullWidth size="small">
              <InputLabel>Choose previously uploaded CVs</InputLabel>
              <Select
                multiple
                value={selectedFileIds}
                onChange={handleFileIdChange}
                input={<OutlinedInput label="Choose previously uploaded CVs" />}
                disabled={isDisabled}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const file = cvFiles.find(f => f.id === value);
                      return (
                        <Chip 
                          key={value}
                          label={file ? getFileNameFromUrl(file.fileUrl) : `File ${value}`}
                          size="small"
                          onDelete={isDisabled ? undefined : (event) => handleChipDelete(event, value)}
                          onMouseDown={(event) => {
                            // Prevent the Select from opening when clicking on chips
                            event.stopPropagation();
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {cvFiles.map((file) => (
                  <MenuItem key={file.id} value={file.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <FileIcon color="primary" fontSize="small" />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                          {getFileNameFromUrl(file.fileUrl)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(file.uploadedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Divider */}
        {cvFiles.length > 0 && (
          <Divider>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>
        )}

        {/* New File Upload */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            Upload New Files
          </Typography>
          
          <Box
            {...getRootProps()}
            sx={dropzoneStyle(theme, isDragReject, isDragActive, isDisabled)}
          >
            <input {...getInputProps()} />
            <UploadIcon
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
              Supported formats: PDF, DOCX (max {maxFiles - totalSelected} more files)
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

          {uploadError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError}
            </Alert>
          )}

          {totalSelected >= maxFiles && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Maximum number of files reached ({maxFiles})
            </Alert>
          )}
        </Box>
      </Box>

      {/* Selected Files List */}
      {(selectedFileDetails.length > 0 || selectedFiles.length > 0) && (
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
              Selected Files ({totalSelected})
            </Typography>
          </Box>
          <List dense sx={{ p: 0 }}>
            {/* Existing Files */}
            {selectedFileDetails.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  bgcolor: "white",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ mr: 1 }}>
                  <FileIcon color="success" fontSize="small" />
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {getFileNameFromUrl(file.fileUrl)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Uploaded {formatDate(file.uploadedAt)} • Existing
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Remove file">
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFileId(file.id)}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                      disabled={isDisabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            {/* New Files */}
            {selectedFiles.map((file, index) => (
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
                <Box sx={{ mr: 1 }}>
                  <FileIcon color="primary" fontSize="small" />
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)} • New
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Remove file">
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveNewFile(file)}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                      disabled={isDisabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
