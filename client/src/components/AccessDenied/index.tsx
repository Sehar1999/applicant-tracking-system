import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import {
  rolBaseBoxStyle,
  rolBaseContainerStyle,
} from "../../constants/StyledConstants";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export const AccessDenied = () => (
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
