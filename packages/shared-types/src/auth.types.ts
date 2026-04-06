import { UserWithoutPassword } from './user.types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserWithoutPassword;
}