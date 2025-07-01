import { Box, Paper } from "@mui/material";
import type { FC } from "react";
import { formPaperLayoutStyle } from "../constants/StyledConstants";
import type { ChildrenProps } from "../types";

export const FormPaperLayout: FC<ChildrenProps> = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="inherit"
  >
    <Paper elevation={4} sx={formPaperLayoutStyle}>
      {children}
    </Paper>
  </Box>
);
