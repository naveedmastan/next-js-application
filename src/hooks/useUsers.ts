import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/users'
import { User } from '@/types/user'

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
