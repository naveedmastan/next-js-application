export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface ForgotPasswordData {
  email: string
}