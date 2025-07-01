import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import IconButton from "@mui/material/IconButton";
import {
  closeSnackbar,
  SnackbarProvider as NotistackProvider,
} from "notistack";
import { useRef, type FC } from "react";
import type { ChildrenProps } from "../../types";
import { StyledIcon, StyledNotistack } from "./styles";

export const SnackbarProvider: FC<ChildrenProps> = ({ children }) => {
  const notistackRef = useRef<NotistackProvider>(null);

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      variant="success"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            <InfoIcon sx={{ width: 24, height: 24 }} />
          </StyledIcon>
        ),
        success: (
          <StyledIcon color="success">
            <CheckCircleIcon sx={{ width: 24, height: 24 }} />
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color="warning">
            <WarningIcon sx={{ width: 24, height: 24 }} />
          </StyledIcon>
        ),
        error: (
          <StyledIcon color="error">
            <ErrorIcon sx={{ width: 24, height: 24 }} />
          </StyledIcon>
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      // with close as default
      action={(snackbarId) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(snackbarId)}
          sx={{ p: 0.5 }}
        >
          <CloseIcon sx={{ width: 16, height: 16 }} />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
};
