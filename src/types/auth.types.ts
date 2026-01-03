import type { Roles } from "@/enums/roles.enum";

// login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: Data;
  message: string;
}

export interface Data {
  user: User;
}

export interface User {
  id: string;
  name: string;
  userName: string;
  role: Roles;
  dni: string;
}

// logout
export interface LogoutResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  message: string;
}

// refresh token
export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: null;
}

// login with pin
export interface LoginWithPinRequest {
  pin: string;
}

export interface LoginWithPinResponse {
  success: boolean;
  data: Data;
  message: string;
}

export interface Data {
  user: User;
}

export interface User {
  id: string;
  name: string;
  userName: string;
  role: Roles;
  dni: string;
}

// me
export interface MeResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  id: string;
  name: string;
  userName: string;
  role: string;
  dni: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  level: number;
}

// change password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}
