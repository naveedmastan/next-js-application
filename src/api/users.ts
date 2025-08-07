import { apiClient } from './client'
import { User } from '@/types/user'
import { ApiResponse } from '@/types/api'

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users')
  return response.data
}

export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`)
  return response.data
}

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await apiClient.post<User>('/users', userData)
  return response.data
}

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}

// Search users
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/users?q=${encodeURIComponent(query)}`)
  return response.data
}

// Get users with pagination
export const getUsersPaginated = async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
  const response = await apiClient.get<ApiResponse<User[]>>(`/users?_page=${page}&_limit=${limit}`)
  return response.data
}
