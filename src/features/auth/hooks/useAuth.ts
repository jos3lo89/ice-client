import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getRoleBasedRedirect = (role: string): string => {
  const redirectMap: Record<string, string> = {
    ADMIN: "/",
    CAJERO: "/cash-register",
    MESERO: "/tables",
    BARTENDER: "/bar",
    COCINERO: "/kitchen",
  };
  return redirectMap[role] || "/";
};

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthStore();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("¡Bienvenido!", {
          description: `Hola ${response.data.user.name}`,
        });

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

  const logout = () => {
    return useMutation({
      mutationFn: authApi.logout,
      onSuccess: (data) => {
        console.log("success", data);
        toast.success("Logout successfully");
      },
      onError: (error) => {
        console.log("error", error);
        toast.error("Logout failed");
      },
    });
  };

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

  const loginWithPin = useMutation({
    mutationFn: authApi.loginWithPin,
    onSuccess: (response) => {
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("¡Acceso concedido!", {
          description: `Hola ${response.data.user.name}`,
        });

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
