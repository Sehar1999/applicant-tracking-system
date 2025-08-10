import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { API_BASE_URL, endpoints, ROUTES } from '../constants';
import { useAuthStore } from '../zustand/auth/store';
import { CustomController } from '../components/CustomController';

interface JobDescription {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface JobDescriptionResponse {
  success: boolean;
  data?: JobDescription[];
  message?: string;
}

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Form states
  const [currentJD, setCurrentJD] = useState<JobDescription | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form methods for modals
  const editMethods = useForm<{ jobDescription: string }>({
    defaultValues: {
      jobDescription: '',
    },
  });

  const createMethods = useForm<{ jobDescription: string }>({
    defaultValues: {
      jobDescription: '',
    },
  });

  // Fetch job descriptions
  const fetchJobDescriptions = async () => {
    try {
      setLoading(true);
      if (!accessToken) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}${endpoints.jobs.getAll}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: JobDescriptionResponse = await response.json();
      
      if (data.success && data.data) {
        setJobDescriptions(data.data);
      } else {
        setError(data.message || 'Failed to fetch job descriptions');
      }
    } catch (err) {
      console.error('Error fetching job descriptions:', err);
      setError('Failed to load job descriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  // Truncate description for card display
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle create
  const handleCreate = async () => {
    const formData = createMethods.getValues();
    if (!formData.jobDescription.trim()) return;

    try {
      setFormLoading(true);
      if (!accessToken) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}${endpoints.jobs.create}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.jobDescription.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchJobDescriptions();
        setCreateModalOpen(false);
        createMethods.reset();
      } else {
        setError(data.message || 'Failed to create job description');
      }
    } catch (err) {
      console.error('Error creating job description:', err);
      setError('Failed to create job description');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    const formData = editMethods.getValues();
    if (!currentJD || !formData.jobDescription.trim()) return;

    try {
      setFormLoading(true);
      if (!accessToken) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}${endpoints.jobs.update}/${currentJD.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.jobDescription.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchJobDescriptions();
        setEditModalOpen(false);
        setCurrentJD(null);
        editMethods.reset();
      } else {
        setError(data.message || 'Failed to update job description');
      }
    } catch (err) {
      console.error('Error updating job description:', err);
      setError('Failed to update job description');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!currentJD) return;

    try {
      setFormLoading(true);
      if (!accessToken) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}${endpoints.jobs.delete}/${currentJD.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchJobDescriptions();
        setDeleteModalOpen(false);
        setCurrentJD(null);
      } else {
        setError(data.message || 'Failed to delete job description');
      }
    } catch (err) {
      console.error('Error deleting job description:', err);
      setError('Failed to delete job description');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle compare navigation
  const handleCompare = (jd: JobDescription) => {
    navigate(`${ROUTES.main.dashboard}?jdId=${jd.id}`);
  };

  // Handle view
  const handleView = (jd: JobDescription) => {
    setCurrentJD(jd);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (jd: JobDescription) => {
    setCurrentJD(jd);
    editMethods.setValue('jobDescription', jd.description);
    setEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (jd: JobDescription) => {
    setCurrentJD(jd);
    setDeleteModalOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WorkIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Job Descriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Create New
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Job Descriptions Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading job descriptions...
          </Typography>
        </Box>
      ) : jobDescriptions.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8,
            textAlign: 'center' 
          }}
        >
          <WorkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No job descriptions yet
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Create your first job description to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Create Job Description
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {jobDescriptions.map((jd) => (
            <Card
              key={jd.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Job Description Content */}
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      minHeight: 80,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {truncateText(jd.description)}
                  </Typography>

                  {/* Date */}
                  <Chip
                    label={`Created ${formatDate(jd.createdAt)}`}
                    size="small"
                    sx={{
                      backgroundColor: 'grey.100',
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  />
                </CardContent>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'grey.50',
                  }}
                >
                  <Tooltip title="View">
                    <IconButton 
                      size="small" 
                      onClick={() => handleView(jd)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.50' }
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(jd)}
                      sx={{ 
                        color: 'warning.main',
                        '&:hover': { backgroundColor: 'warning.50' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteConfirm(jd)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.50' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Compare">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCompare(jd)}
                      sx={{ 
                        color: 'success.main',
                        '&:hover': { backgroundColor: 'success.50' }
                      }}
                    >
                      <CompareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
          ))}
        </Box>
      )}

      {/* Create Modal */}
      <Dialog 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Job Description</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormProvider {...createMethods}>
            <CustomController
              controllerName="jobDescription"
              controllerLabel=""
              fieldType="jobDescription"
              placeholderString="Enter job description..."
              isDisabled={formLoading}
            />
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateModalOpen(false);
            createMethods.reset();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!createMethods.watch('jobDescription')?.trim() || formLoading}
          >
            {formLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Job Description</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormProvider {...editMethods}>
            <CustomController
              controllerName="jobDescription"
              controllerLabel=""
              fieldType="jobDescription"
              placeholderString="Enter job description..."
              isDisabled={formLoading}
            />
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditModalOpen(false);
            setCurrentJD(null);
            editMethods.reset();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            variant="contained"
            disabled={!editMethods.watch('jobDescription')?.trim() || formLoading}
          >
            {formLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Modal */}
      <Dialog 
        open={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Job Description</DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              py: 2,
            }}
          >
            {currentJD?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this job description? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={formLoading}
          >
            {formLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
