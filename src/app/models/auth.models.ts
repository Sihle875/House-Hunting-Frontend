// src/app/models/auth.models.ts

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  refreshToken?: string;
  email: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  role?: string;
  roles?: string[];
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  roles?: string[];
}