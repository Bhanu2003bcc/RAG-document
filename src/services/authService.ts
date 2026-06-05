import api from './api'
import { AuthResponse, ApiResponse } from '../types'

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { username, password })
    return data.data
  },
  register: async (username: string, email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', { username, email, password })
    return data.data
  },
}
