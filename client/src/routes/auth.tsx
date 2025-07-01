import { Suspense } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { ROUTES } from "../constants";
import { SignupPage } from "../Pages/SignupPage";
import { LoadingScreen } from "../components/LoadingScreen/LoadingScreen";
import { GuestGuard } from "../guard/GuestGuard";
import { AuthLayout } from "../Layouts/Auth";
import LoginPage from "../Pages/LoginPage";

export const authRoutes: RouteObject[] = [
  {
    path: ROUTES.auth.main,
    element: (
      <GuestGuard>
        <AuthLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      </GuestGuard>
    ),
    children: [
      { path: ROUTES.auth.login, element: <LoginPage /> },
      { path: ROUTES.auth.register, element: <SignupPage /> },
    ],
  },
];
