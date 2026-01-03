import { useAuthStore } from "@/stores/authStore";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default AuthGuard;
