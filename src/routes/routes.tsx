import AuthLayout from "@/layouts/AuthLayout";
import { createBrowserRouter } from "react-router-dom";
import {
  DashboardPage,
  LoginPage,
  OrderPage,
  OrdersListPage,
  TablesPage,
} from "./lazy";
import { Suspense } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import AuthGuard from "@/guards/AuthGuard";
import RoleGuard from "@/guards/RoleGuard";
import { Roles } from "@/enums/roles.enum";
import WaiterLayout from "@/layouts/WaiterLayout";
import LoadingForPage from "@/components/LoadingForPage";

export const routes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[Roles.ADMIN]}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[Roles.MESERO]}>
          <WaiterLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "/tables",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <TablesPage />
          </Suspense>
        ),
      },
      {
        path: "/orders",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <OrdersListPage />
          </Suspense>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <OrderPage />
          </Suspense>
        ),
      },
      {
        path: "/tables/:tableId/order",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <OrderPage />
          </Suspense>
        ),
      },
    ],
  },
]);
