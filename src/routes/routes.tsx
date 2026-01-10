import AuthLayout from "@/layouts/AuthLayout";
import { createBrowserRouter } from "react-router-dom";
import {
  CashierOrdersPage,
  CashierPage,
  CashRegisterPage,
  DashboardPage,
  LoginPage,
  OrderPage,
  OrdersListPage,
  TablasCashierPage,
  TablesPage,
} from "./lazy";
import { Suspense } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import AuthGuard from "@/guards/AuthGuard";
import RoleGuard from "@/guards/RoleGuard";
import { Roles } from "@/enums/roles.enum";
import WaiterLayout from "@/layouts/WaiterLayout";
import LoadingForPage from "@/components/LoadingForPage";
import CashierLayout from "@/layouts/CashierLayout";
import NotFoundPage from "@/pages/NotFoundPage";

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
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[Roles.CAJERO]}>
          <CashierLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "/cashier",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <CashierPage />
          </Suspense>
        ),
      },
      {
        path: "/cashier/cash-register",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <CashRegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/cashier/orders",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <CashierOrdersPage />
          </Suspense>
        ),
      },
      {
        path: "/cashier/mesas",
        element: (
          <Suspense fallback={<LoadingForPage />}>
            <TablasCashierPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
