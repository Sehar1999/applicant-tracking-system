import { Box } from "@mui/material";
import type { FC } from "react";
import { FormPaperLayout } from "../../Layouts/FormPAper";
import type { ChildrenProps } from "../../types";
import { Header } from "../Header";

export const AuthLayout: FC<ChildrenProps> = ({ children }) => (
  <Box>
    <Header isAuth />

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
      }}
    >
      <FormPaperLayout>{children}</FormPaperLayout>
    </Box>
  </Box>
);
