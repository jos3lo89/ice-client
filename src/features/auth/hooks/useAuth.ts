import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { getRoleBasedRedirect } from "@/utils/roleBaseRedirect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated, logout: clearAuth } = useAuthStore();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);

        const redirectPath = getRoleBasedRedirect(response.data.user.role);
        navigate(redirectPath, { replace: true });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al iniciar sesión", {
        description:
          error.response?.data?.message || "Usuario o contraseña incorrectos",
      });
    },
  });

  const loginWithPin = useMutation({
    mutationFn: authApi.loginWithPin,
    onSuccess: (response) => {
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);

        const redirectPath = getRoleBasedRedirect(response.data.user.role);
        navigate(redirectPath, { replace: true });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("PIN incorrecto", {
        description:
          error.response?.data?.message ||
          "Verifica tu PIN e intenta nuevamente",
      });
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
      toast.error("Error al cerrar sesión");
    },
  });

  const changePassword = () => {
    return useMutation({
      mutationFn: authApi.changePassword,
      onSuccess: (data) => {
        console.log("success", data);
        toast.success("Password changed successfully");
      },
      onError: (error) => {
        console.log("error", error);
        toast.error("Password change failed");
      },
    });
  };

  const me = () => {
    return useMutation({
      mutationFn: authApi.me,
      onSuccess: (data) => {
        console.log("success", data);
        toast.success("User fetched successfully");
      },
      onError: (error) => {
        console.log("error", error);
        toast.error("User fetch failed");
      },
    });
  };

  const refreshToken = () => {
    return useMutation({
      mutationFn: authApi.refreshToken,
      onSuccess: (data) => {
        console.log("success", data);
        toast.success("Refresh token successfully");
      },
      onError: (error) => {
        console.log("error", error);
        toast.error("Refresh token failed");
      },
    });
  };

  return {
    login,
    loginWithPin,
    logout,
    changePassword,
    currentUser: me,
    refreshToken,
  };
};
