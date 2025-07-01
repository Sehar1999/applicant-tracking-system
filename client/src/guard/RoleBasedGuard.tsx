import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  rolBaseBoxStyle,
  rolBaseContainerStyle,
} from "../constants/StyledConstants";
import { UserRoleEnum, type RoleBasedGuardProp } from "../types";
import { useAuthStore } from "../zustand/auth/store";

export const RoleBasedGuard = ({ roles, children }: RoleBasedGuardProp) => {
  const { user } = useAuthStore();
  const { roles: userRoles } = user || {};

  const hasRequiredRole = () => {
    if (!roles || !userRoles) return false;
    return userRoles.some((userRole) =>
      roles.includes(userRole.name as UserRoleEnum)
    );
  };

  if (!hasRequiredRole()) {
    return (
      <Container sx={rolBaseContainerStyle}>
        <Box sx={rolBaseBoxStyle}>
          <LockOutlinedIcon
            sx={{
              fontSize: 64,
              color: "primary.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h3"
            color="primary.main"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Permission Denied
          </Typography>

          <Typography variant="body1" color="text.secondary" maxWidth="400px">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </Typography>

          <Button
            component={Link}
            variant="contained"
            size="large"
            to={ROUTES.main.dashboard}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return children;
};
