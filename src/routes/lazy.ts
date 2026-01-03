import { lazy } from "react";

export const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
export const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

export const TablesPage = lazy(
  () => import("@/features/tables/pages/TablesPage"),
);

export const OrderPage = lazy(
  () => import("@/features/orders/pages/OrderPage"),
);

export const OrdersListPage = lazy(
  () => import("@/features/orders/pages/OrdersListPage"),
);
