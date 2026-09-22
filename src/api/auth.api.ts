import { apiGet, apiPost, apiPatch } from './client';
import { User, UserProfile, UserRole } from '../types/auth';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: { id: string; name: string; email: string; role: UserRole };
}

// POST /api/auth/register
export const apiRegister = (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<RegisterResponse> =>
  apiPost<RegisterResponse>('/auth/register', { name, email, password, role });

// GET /api/auth/verify?token=...
export const apiVerifyEmail = (token: string): Promise<AuthResponse> =>
  apiGet<AuthResponse>(`/auth/verify?token=${encodeURIComponent(token)}`);

// POST /api/auth/login
export const apiLogin = (email: string, password: string): Promise<AuthResponse> =>
  apiPost<AuthResponse>('/auth/login', { email, password });

// POST /api/auth/forgot-password
export const apiForgotPassword = (email: string): Promise<{ message: string }> =>
  apiPost<{ message: string }>('/auth/forgot-password', { email });

// POST /api/auth/reset-password
export const apiResetPassword = (token: string, newPassword: string): Promise<{ message: string }> =>
  apiPost<{ message: string }>('/auth/reset-password', { token, newPassword });

// GET /api/auth/me
export const apiGetMe = (): Promise<User> =>
  apiGet<User>('/auth/me');

// PATCH /api/auth/profile
export const apiUpdateProfile = (profile: Partial<UserProfile & { name?: string }>): Promise<User> =>
  apiPatch<User>('/auth/profile', profile);
