export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  createdAt?: string;
  trips?: string[];
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}