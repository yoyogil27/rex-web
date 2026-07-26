// types/user.ts

export type UserRole = "guest" | "user" | "creator" | "organization" | "admin";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  savedExperiences: string[];
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface SignInData {
  identifier: string; // email or phone
  password?: string; // optional if using OTP
  otp?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}