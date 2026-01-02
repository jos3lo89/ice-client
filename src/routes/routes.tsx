import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AuthLayout from "@/layouts/AuthLayout";
import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from ".";
import { Suspense } from "react";

export const routes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <DashboardPage />,
  },
]);
