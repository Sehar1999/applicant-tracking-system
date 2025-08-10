import { Suspense } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { ROUTES } from "../constants";
import { MainLayout } from "../Layouts/main/MainLayout";
import { DashboardPage } from "../Pages/DashboardPage";
import { ResumesPage } from "../Pages/ResumesPage";
import { JobsPage } from "../Pages/JobsPage";
import { Profile } from "../components/Profile";
import { LoadingScreen } from "../components/LoadingScreen/LoadingScreen";
import { AuthProvider } from "../Provider/AuthProvider";
import { RoleBasedGuard } from "../guard/RoleBasedGuard";
import { UserRoleEnum } from "../types";

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.main.dashboard,
    element: (
      <AuthProvider>
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: ROUTES.main.resumes,
        element: (
          <RoleBasedGuard allowedRoles={[UserRoleEnum.RECRUITER]}>
            <ResumesPage />
          </RoleBasedGuard>
        ),
      },
      {
        path: ROUTES.main.jobs,
        element: (
          <RoleBasedGuard allowedRoles={[UserRoleEnum.RECRUITER]}>
            <JobsPage />
          </RoleBasedGuard>
        ),
      },
      { path: ROUTES.main.profile, element: <Profile /> },
    ],
  },
];
