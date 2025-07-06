export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User | { email: string; username: string };
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    data: RegisterRequest,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}
