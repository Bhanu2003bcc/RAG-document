export interface User {
  userId: string
  username: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  userId: string
  username: string
  email: string
  role: string
}

export interface Document {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  language: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  chunkCount: number
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SourceReference[]
  createdAt: string
  streaming?: boolean
}

export interface SourceReference {
  documentId: string
  documentTitle: string
  excerpt: string
  relevanceScore: number
  chunkIndex: number
}

export interface Conversation {
  id: string
  title: string
  messages?: Message[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
