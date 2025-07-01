import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import theme from "../theme/theme";
import { SnackbarProvider } from "notistack";
import { Suspense } from "react";
import { useAuthStore } from "./zustand/auth/store";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { MainRoutes } from "./routes";

function App() {
  const { logout } = useAuthStore();
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error("Global Error Handler:", error);
        // You can even redirect or logout from here if needed
        // We need to handle the errors like 401 Unauthorized or 403 Forbidden
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          console.warn("Unauthorized or Forbidden! Redirecting to login...");
          logout();
        }
      },
    }),
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Suspense fallback={<LoadingScreen />}>
            <QueryClientProvider client={queryClient}>
              <MainRoutes />
            </QueryClientProvider>
          </Suspense>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
