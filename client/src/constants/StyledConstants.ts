import type { Theme } from "@mui/material";
import { HEADER } from ".";

export const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const notFoundBoxStyle = {
  ...flexCenter,
  flexDirection: "column",
  minHeight: "calc(100vh - 100px)",
  textAlign: "center",
  gap: 3,
};

export const rolBaseContainerStyle = {
  ...flexCenter,
  flexDirection: 'column',
  minHeight: 'calc(100vh - 110px)',
  textAlign: 'center',
};

export const rolBaseBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  p: 4,
  borderRadius: 2,
  bgcolor: 'background.paper',
  boxShadow: (theme: Theme) => `0 8px 24px ${theme.palette.grey[200]}`,
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: (theme: Theme) => `0 12px 32px ${theme.palette.grey[300]}`,
  },
};

export const formPaperLayoutStyle = {
  p: { xs: 3, sm: 5 },
  minWidth: { xs: 300, sm: 380 },
  maxWidth: 420,
  width: '100%',
  borderRadius: 4,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
  background: 'rgba(255,255,255,0.98)',
};

// Enhanced Authentication Styles
export const authMainContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(10px)',
  }
};

export const authSplitContainerStyle = {
  display: 'flex',
  width: '100%',
  minHeight: '100%',
  position: 'relative',
  zIndex: 1,
};

export const authLeftPanelStyle = {
  flex: 1,
  display: { xs: 'none', md: 'flex' },
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 4,
  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(147, 51, 234, 0.9) 100%)',
  color: 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E")',
    opacity: 0.3,
  }
};

export const authRightPanelStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: { xs: 3, sm: 4, md: 6 },
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  // Add mobile-first responsive design
  width: { xs: '100%', md: '50%' },
  minHeight: { xs: 'calc(100vh - 80px)', md: '100%' },
};

export const authFormCardStyle = {
  width: '100%',
  maxWidth: 460,
  background: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 3,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  padding: { xs: 4, sm: 5 },
  position: 'relative',
  transform: 'translateY(0)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  // Enhanced responsive styles
  margin: { xs: 2, sm: 0 },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px 12px 0 0',
  },
  // Add subtle animation on load
  animation: 'fadeIn 0.8s ease-out',
  '@keyframes fadeIn': {
    'from': { 
      opacity: 0,
      transform: 'translateY(20px)',
    },
    'to': { 
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export const authTitleStyle = {
  fontSize: { xs: '2rem', sm: '2.5rem' },
  fontWeight: 800,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: 1,
  textAlign: 'center',
};

export const authSubtitleStyle = {
  fontSize: '1.1rem',
  color: 'text.secondary',
  textAlign: 'center',
  marginBottom: 4,
  fontWeight: 400,
};

export const enhancedInputFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(37, 99, 235, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '2px solid #667eea',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(37, 99, 235, 0.2)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '1rem',
  },
};

export const enhancedButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 2,
  padding: '14px 28px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  color: 'white',
  border: 'none',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  width: '100%',
  marginTop: 3,
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    color: '#64748b',
    boxShadow: 'none',
    transform: 'none',
  },
};

export const authSecondaryButtonStyle = {
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  padding: '8px 0',
  borderRadius: 1,
  '&:hover': {
    color: '#764ba2',
    background: 'rgba(102, 126, 234, 0.1)',
    textDecoration: 'none',
  },
};

export const authBrandIconStyle = {
  fontSize: '4rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 900,
  marginBottom: 3,
  textAlign: 'center',
};

export const authWelcomeTextStyle = {
  fontSize: { xs: '2.5rem', md: '3.5rem' },
  fontWeight: 900,
  color: 'white',
  textAlign: 'center',
  marginBottom: 2,
  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
};

export const authDescriptionStyle = {
  fontSize: '1.3rem',
  color: 'rgba(255, 255, 255, 0.9)',
  textAlign: 'center',
  lineHeight: 1.6,
  maxWidth: '400px',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
};

export const authFloatingElementStyle = {
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
  // Hide on mobile for better performance
  display: { xs: 'none', md: 'block' },
};

export const headerStyle = {
  height: HEADER.H_MOBILE,
  zIndex: (theme: Theme) => theme.zIndex.appBar + 1,
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(10px)',
  transition: (theme: Theme) =>
    theme.transitions.create(['height', 'box-shadow'], {
      duration: theme.transitions.duration.shorter,
    }),
};

export const loadingButtonStyle = {
  mt: 2,
  fontWeight: 700,
  fontSize: '1.08rem',
  borderRadius: 2,
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
  textTransform: 'none',
  letterSpacing: 0.2,
  width: '100%',
  transition: 'background 0.2s',
  backgroundColor: 'primary',
  '&:hover': {
    backgroundColor: 'primary',
  },
};

export const secondaryButtonStyle = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.98rem',
  p: 0,
  minWidth: 'unset',
  outline: 'none',
};

export const toolbarStyles = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexWrap: "nowrap",
  gap: theme.spacing(0.5),
  overflowX: "auto",
  minHeight: "48px",
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '2px',
  },
})

export const editorContainer = (theme: Theme) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
})

export const dropzoneStyle = (theme: Theme, isDragReject: boolean, isDragActive: boolean, disabled: boolean) => ({
    border: `2px dashed ${
      isDragReject
        ? "#d32f2f"
        : isDragActive
        ? theme.palette.primary.main
        : theme.palette.divider
    }`,
    borderRadius: 1,
    padding: theme.spacing(3),
    textAlign: "center" as const,
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: isDragActive
      ? `${theme.palette.primary.main}08`
      : isDragReject
      ? "#ffebee"
      : "transparent",
    transition: "all 0.2s ease-in-out",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  })