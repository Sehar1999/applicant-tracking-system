import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import { notFoundBoxStyle } from "../constants/StyledConstants";

export const NotFound = () => (
  <Container maxWidth="sm">
    <Box sx={notFoundBoxStyle}>
      <Typography variant="h1">404</Typography>

      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
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
