import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse } from '../types'

interface AuthState {
  token: string | null
  user: Omit<AuthResponse, 'token' | 'tokenType'> | null
  setAuth: (auth: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: 'mock-jwt-token',
      user: { userId: '1', username: 'Bhanu', email: 'bhanu@example.com', role: 'USER' },
      setAuth: (auth) => set({
        token: auth.token,
        user: { userId: auth.userId, username: auth.username, email: auth.email, role: auth.role }
      }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
