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
      token: null,
      user: null,
      setAuth: (auth) => set({
        token: auth.token,
        user: { userId: auth.userId, username: auth.username, email: auth.email, role: auth.role }
      }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
