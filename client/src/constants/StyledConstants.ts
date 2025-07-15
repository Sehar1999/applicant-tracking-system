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