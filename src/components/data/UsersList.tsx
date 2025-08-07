'use client'

import { useUsers } from '@/hooks/useUsers'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/Button'
import { User } from '@/types/user'

export function UsersList() {
  const { data: users, isLoading, error, refetch } = useUsers()
  const { selectedUser, setSelectedUser, addUser } = useUserStore()

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  const handleAddToStore = (user: User) => {
    addUser(user)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load users</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Users ({users.length})
        </h3>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedUser?.id === user.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelectUser(user)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.company && (
                  <p className="text-xs text-gray-500 mt-1">{user.company.name}</p>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToStore(user)
                }}
                variant="outline"
                size="sm"
              >
                Add to Store
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Selected User</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Website:</strong> {selectedUser.website}</p>
          </div>
        </div>
      )}
    </div>
  )
}
