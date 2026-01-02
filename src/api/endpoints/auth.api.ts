import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LoginWithPinRequest,
  LoginWithPinResponse,
  LogoutResponse,
  MeResponse,
  RefreshTokenResponse,
} from "@/types/auth.types";
import axiosI from "../axios";

export const authApi = {
  login: async (values: LoginRequest) => {
    const { data } = await axiosI.post<LoginResponse>("/auth/login", values);
    return data;
  },
  logout: async () => {
    const { data } = await axiosI.post<LogoutResponse>("/auth/logout");
    return data;
  },
  refreshToken: async () => {
    const { data } = await axiosI.post<RefreshTokenResponse>("/auth/refresh");
    return data;
  },
  loginWithPin: async (values: LoginWithPinRequest) => {
    const { data } = await axiosI.post<LoginWithPinResponse>(
      "/auth/login/pin",
      values,
    );
    return data;
  },
  me: async () => {
    const { data } = await axiosI.get<MeResponse>("/auth/me");
    return data;
  },
  changePassword: async (values: ChangePasswordRequest) => {
    const { data } = await axiosI.post<ChangePasswordResponse>(
      "/auth/change-password",
      values,
    );
    return data;
  },
};
