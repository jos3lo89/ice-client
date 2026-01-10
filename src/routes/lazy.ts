import { lazy } from "react";

export const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
export const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage")
);

export const TablesPage = lazy(
  () => import("@/features/tables/pages/TablesPage")
);

export const OrderPage = lazy(
  () => import("@/features/orders/pages/OrderPage")
);

export const OrdersListPage = lazy(
  () => import("@/features/orders/pages/OrdersListPage")
);

export const CashierOrdersPage = lazy(
  () => import("@/features/cashier/pages/CashierOrdersPage")
);

export const CashRegisterPage = lazy(
  () => import("@/features/cash-registers/pages/CashRegisterPage")
);

export const CashierPage = lazy(
  () => import("@/features/cashier/pages/CashierPage")
);

export const TablasCashierPage = lazy(
  () => import("@/features/cashier/pages/TablesCashier")
);
