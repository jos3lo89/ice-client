import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/authStore";

const GuestGuard = ({ children }: PropsWithChildren) => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default GuestGuard;
