import { Box } from "@mui/material";
import { Header } from "../Header";
import type { ChildrenProps } from "../../types";

export const MainLayout = ({ children }: ChildrenProps) => (
  <Box>
    <Header />

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  </Box>
);
