export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ApiError {
  message: string;
}

export interface User {
  id: string | number;
  email: string;
}
