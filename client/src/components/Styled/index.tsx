import { Button, StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledNavButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    transform: "scaleX(0)",
    transition: "transform 0.2s ease-in-out",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
  "&.active::after": {
    transform: "scaleX(1)",
  },
}));

export const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 50%, ${theme.palette.success.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));
