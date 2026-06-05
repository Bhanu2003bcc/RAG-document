import api from './api'
import { Document, ApiResponse, PageResponse } from '../types'

export const documentService = {
  upload: async (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<ApiResponse<Document>>('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => onProgress && onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
    })
    return data.data
  },
  getDocuments: async (page = 0, size = 20) => {
    const { data } = await api.get<ApiResponse<PageResponse<Document>>>(`/documents?page=${page}&size=${size}`)
    return data.data
  },
  getDocument: async (id: string) => {
    const { data } = await api.get<ApiResponse<Document>>(`/documents/${id}`)
    return data.data
  },
  deleteDocument: async (id: string) => {
    await api.delete(`/documents/${id}`)
  },
}
