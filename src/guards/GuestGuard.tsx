import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getRoleBasedRedirect } from "@/utils/roleBaseRedirect";

const GuestGuard = ({ children }: PropsWithChildren) => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    const redirectPath = getRoleBasedRedirect(user.role);
    console.log(`estas login redirigir a ${redirectPath}`);

    return <Navigate to="/" replace />;
  }

  return children;
};
export default GuestGuard;
