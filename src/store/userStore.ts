import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types/user'

interface UserStore {
  users: User[]
  selectedUser: User | null
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  removeUser: (userId: number) => void
  setSelectedUser: (user: User | null) => void
  clearUsers: () => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        selectedUser: null,
        
        setUsers: (users) => set({ users }),
        
        addUser: (user) => set((state) => {
          const exists = state.users.some(u => u.id === user.id)
          if (exists) return state
          return { users: [...state.users, user] }
        }),
        
        removeUser: (userId) => set((state) => ({
          users: state.users.filter(user => user.id !== userId),
          selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser
        })),
        
        setSelectedUser: (user) => set({ selectedUser: user }),
        
        clearUsers: () => set({ users: [], selectedUser: null }),
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          users: state.users,
          selectedUser: state.selectedUser,
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
)
