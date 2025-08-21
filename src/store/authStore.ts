'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, AuthState, LoginCredentials, SignupCredentials, ForgotPasswordData } from '@/types/auth'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  signup: (credentials: SignupCredentials) => Promise<boolean>
  logout: () => void
  forgotPassword: (data: ForgotPasswordData) => Promise<boolean>
  clearError: () => void
  error: string | null
}

// Mock users for demonstration
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
]

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock authentication
          const user = MOCK_USERS.find(
            u => u.email === credentials.email && u.password === credentials.password
          )
          
          if (user) {
            const { password, ...userWithoutPassword } = user
            set({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              error: 'Invalid email or password',
              isLoading: false,
            })
            return false
          }
        },

        signup: async (credentials: SignupCredentials) => {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if user already exists
          const existingUser = MOCK_USERS.find(u => u.email === credentials.email)
          if (existingUser) {
            set({
              error: 'User with this email already exists',
              isLoading: false,
            })
            return false
          }
          
          // Create new user
          const newUser: User & { password: string } = {
            id: Date.now().toString(),
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            createdAt: new Date().toISOString(),
          }
          
          MOCK_USERS.push(newUser)
          
          const { password, ...userWithoutPassword } = newUser
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
        },

        forgotPassword: async (data: ForgotPasswordData) => {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock forgot password - always return success for demo
          const user = MOCK_USERS.find(u => u.email === data.email)
          if (user) {
            set({
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              error: 'No account found with this email address',
              isLoading: false,
            })
            return false
          }
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)