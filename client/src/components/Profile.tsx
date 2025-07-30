import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Chip,
  Container,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera as CameraIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useAuthStore } from "../zustand/auth/store";
import { useUpdateProfile, useUpdateProfilePicture } from "../service.ts";
import { profileUpdateSchema, passwordChangeSchema } from "../Schemas";
import type { ProfileUpdateFormType, PasswordChangeFormType } from "../types";
import { CustomController } from "./CustomController";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const [editContactOpen, setEditContactOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const updateProfilePictureMutation = useUpdateProfilePicture();

  const contactForm = useForm<ProfileUpdateFormType>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordChangeFormType>({
    resolver: yupResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleContactUpdate = async (data: ProfileUpdateFormType) => {
    try {
      const response = await updateProfileMutation.mutateAsync(data);
      if (response.success) {
        updateUser(response.data.user);
        setEditContactOpen(false);
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.response?.data?.message ||
        "Failed to update profile";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handlePasswordChange = async (data: PasswordChangeFormType) => {
    try {
      const passwordData: PasswordChangeRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const response = await updateProfileMutation.mutateAsync(
        passwordData as unknown as ProfileUpdateFormType
      );
      if (response.success) {
        setChangePasswordOpen(false);
        passwordForm.reset();
        enqueueSnackbar("Password changed successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        // Handle both direct API error response and wrapped error cases
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any)?.message &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          JSON.parse((error as any).message)?.message) ||
        (error as ErrorResponse)?.response?.data?.message ||
        "Failed to change password";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        enqueueSnackbar("Please select an image file", { variant: "error" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar("Image size must be less than 5MB", {
          variant: "error",
        });
        return;
      }

      try {
        const response = await updateProfilePictureMutation.mutateAsync(file);
        if (response.success) {
          updateUser({ profilePicture: response.data.profilePicture });
          enqueueSnackbar("Profile picture updated successfully!", {
            variant: "success",
          });
        }
      } catch (error) {
        const errorMessage =
          (error as ErrorResponse)?.response?.data?.message ||
          "Failed to update profile picture";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            "#2563eb",
            0.1
          )} 0%, ${alpha("#059669", 0.1)} 100%)`,
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight="700" color="text.primary" mb={6}>
            Profile Settings
          </Typography>

          {/* Profile Header Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "40%",
                height: "100%",
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems="center"
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                {updateProfilePictureMutation.isPending ? (
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255,255,255,0.1)",
                      border: "4px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <CircularProgress size={60} sx={{ color: "white" }} />
                  </Box>
                ) : (
                  <Avatar
                    src={user.profilePicture || undefined}
                    sx={{
                      width: 140,
                      height: 140,
                      fontSize: "3rem",
                      border: "4px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    {!user.profilePicture &&
                      user.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}

                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-picture-input"
                  type="file"
                  onChange={handleProfilePictureChange}
                />
                <label htmlFor="profile-picture-input">
                  <IconButton
                    component="span"
                    disabled={updateProfilePictureMutation.isPending}
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "primary.main",
                      width: 40,
                      height: 40,
                      "&:hover": {
                        bgcolor: "white",
                        transform: updateProfilePictureMutation.isPending
                          ? "none"
                          : "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                      opacity: updateProfilePictureMutation.isPending ? 0.5 : 1,
                    }}
                  >
                    {updateProfilePictureMutation.isPending ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CameraIcon />
                    )}
                  </IconButton>
                </label>
              </Box>

              <Box sx={{ flex: 1, zIndex: 1 }}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  {user.name || "User Profile"}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Chip
                    label={user.role}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Active since {new Date().getFullYear()}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
                  Manage your profile information and security settings
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: -4, pb: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 4,
          }}
        >
          {/* Left Column - Personal Information */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              height: "fit-content",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha("#2563eb", 0.1),
                    color: "primary.main",
                  }}
                >
                  <PersonIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal details
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditContactOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Edit Details
              </Button>
            </Stack>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  textTransform="uppercase"
                  fontWeight="600"
                  mb={1}
                >
                  Full Name
                </Typography>
                <Typography variant="h6" fontWeight="500">
                  {user.name || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  textTransform="uppercase"
                  fontWeight="600"
                  mb={1}
                >
                  Email Address
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight="500">
                    {user.email}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> Your email address is used for account
                verification and important notifications. Please ensure it's
                always up to date.
              </Typography>
            </Box>
          </Paper>

          {/* Right Column - Security Settings */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              height: "fit-content",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha("#059669", 0.1),
                    color: "secondary.main",
                  }}
                >
                  <LockIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your account security
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                textTransform="uppercase"
                fontWeight="600"
                mb={1}
              >
                Password
              </Typography>
              <Typography variant="h6" fontWeight="500" mb={1}>
                ••••••••••••
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated recently
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<LockIcon />}
              onClick={() => setChangePasswordOpen(true)}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Change Password
            </Button>

            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: alpha("#059669", 0.05),
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha("#059669", 0.2),
              }}
            >
              <Typography
                variant="body2"
                color="secondary.main"
                fontWeight="500"
              >
                <strong>Security Tip:</strong> Use a strong password with at
                least 8 characters, including uppercase, lowercase, numbers, and
                special characters.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Edit Contact Information Dialog */}
      <Dialog
        open={editContactOpen}
        onClose={() => setEditContactOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="600">
            Edit Personal Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your basic profile details
          </Typography>
        </DialogTitle>
        <DialogContent>
          <FormProvider {...contactForm}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <CustomController
                controllerName="name"
                controllerLabel="Full Name"
                fieldType="text"
                placeholderString="Enter your full name"
              />
              <CustomController
                controllerName="email"
                controllerLabel="Email Address"
                fieldType="email"
                placeholderString="Enter your email address"
              />
            </Stack>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setEditContactOpen(false)}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={contactForm.handleSubmit(handleContactUpdate)}
            variant="contained"
            disabled={updateProfileMutation.isPending}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="600">
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ensure your account stays secure
          </Typography>
        </DialogTitle>
        <DialogContent>
          <FormProvider {...passwordForm}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <CustomController
                controllerName="currentPassword"
                controllerLabel="Current Password"
                fieldType="password"
                isPassword={true}
                placeholderString="Enter your current password"
              />
              <CustomController
                controllerName="newPassword"
                controllerLabel="New Password"
                fieldType="password"
                isPassword={true}
                placeholderString="Enter your new password"
              />
              <CustomController
                controllerName="confirmPassword"
                controllerLabel="Confirm New Password"
                fieldType="password"
                isPassword={true}
                placeholderString="Confirm your new password"
              />
            </Stack>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setChangePasswordOpen(false)}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={passwordForm.handleSubmit(handlePasswordChange)}
            variant="contained"
            color="secondary"
            disabled={updateProfileMutation.isPending}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            {updateProfileMutation.isPending
              ? "Changing..."
              : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
