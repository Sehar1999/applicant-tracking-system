import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import {
  authMainContainerStyle,
  authSplitContainerStyle,
  authLeftPanelStyle,
  authRightPanelStyle,
  authWelcomeTextStyle,
  authDescriptionStyle,
  authFloatingElementStyle,
  authBrandIconStyle,
} from "../../constants/StyledConstants";
import type { ChildrenProps } from "../../types";
import { Header } from "../Header";

export const AuthLayout: FC<ChildrenProps> = ({ children }) => (
  <Box>
    <Header isAuth />

    <Box sx={authMainContainerStyle}>
      <Box sx={authSplitContainerStyle}>
        {/* Left Panel - Brand & Welcome */}
        <Box sx={authLeftPanelStyle}>
          {/* Floating Animation Elements */}
          <Box
            sx={{
              ...authFloatingElementStyle,
              width: 120,
              height: 120,
              top: "20%",
              right: "15%",
              animationDelay: "0s",
            }}
          />
          <Box
            sx={{
              ...authFloatingElementStyle,
              width: 80,
              height: 80,
              bottom: "30%",
              left: "10%",
              animationDelay: "2s",
            }}
          />
          <Box
            sx={{
              ...authFloatingElementStyle,
              width: 60,
              height: 60,
              top: "50%",
              left: "20%",
              animationDelay: "4s",
            }}
          />

          {/* Brand Icon */}
          <Typography sx={authBrandIconStyle}>ATS</Typography>

          {/* Welcome Content */}
          <Typography sx={authWelcomeTextStyle}>
            Welcome to the Future of Hiring
          </Typography>

          <Typography sx={authDescriptionStyle}>
            Streamline your recruitment process with our intelligent Applicant
            Tracking System. Connect talent with opportunity seamlessly.
          </Typography>

          {/* Feature Icons */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              mt: 4,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["🚀", "⚡", "🎯", "💎"].map((icon, index) => (
              <Box
                key={index}
                sx={{
                  fontSize: "2rem",
                  p: 2,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.1) rotate(10deg)",
                  },
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Form */}
        <Box sx={authRightPanelStyle}>{children}</Box>
      </Box>
    </Box>
  </Box>
);
