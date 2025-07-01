import { useRoutes } from "react-router-dom";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { NotFoundPage } from "../Pages/NotFoundPage";

export const MainRoutes = () =>
  useRoutes([
    ...authRoutes,

    ...dashboardRoutes,

    { path: "*", element: <NotFoundPage /> },
  ]);
