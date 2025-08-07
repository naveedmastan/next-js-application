import { act, renderHook } from '@testing-library/react'
import { useUserStore } from '@/store/userStore'
import { User } from '@/types/user'

// Mock user data
const mockUser1: User = {
  id: 1,
  name: 'John Doe',
  username: 'john.doe',
  email: 'john.doe@example.com',
  phone: '+1-555-0123',
  website: 'johndoe.com',
  address: {
    street: '123 Main St',
    suite: 'Apt 1',
    city: 'Anytown',
    zipcode: '12345',
    geo: { lat: '40.7128', lng: '-74.0060' }
  },
  company: {
    name: 'Acme Corp',
    catchPhrase: 'Innovative solutions',
    bs: 'enterprise software'
  }
}

const mockUser2: User = {
  id: 2,
  name: 'Jane Smith',
  username: 'jane.smith',
  email: 'jane.smith@example.com',
  phone: '+1-555-0456',
  website: 'janesmith.com',
  address: {
    street: '456 Oak Ave',
    suite: 'Suite 200',
    city: 'Somewhere',
    zipcode: '67890',
    geo: { lat: '34.0522', lng: '-118.2437' }
  },
  company: {
    name: 'Tech Solutions Inc',
    catchPhrase: 'Building the future',
    bs: 'technology consulting'
  }
}

describe('userStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useUserStore())
    act(() => {
      result.current.clearUsers()
    })
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useUserStore())
    
    expect(result.current.users).toEqual([])
    expect(result.current.selectedUser).toBeNull()
  })

  it('sets users correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.setUsers([mockUser1, mockUser2])
    })

    expect(result.current.users).toHaveLength(2)
    expect(result.current.users[0]).toEqual(mockUser1)
    expect(result.current.users[1]).toEqual(mockUser2)
  })

  it('adds a user to the store', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.addUser(mockUser1)
    })

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0]).toEqual(mockUser1)
  })

  it('does not add duplicate users', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.addUser(mockUser1)
      result.current.addUser(mockUser1) // Try to add the same user again
    })

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0]).toEqual(mockUser1)
  })

  it('removes a user from the store', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.setUsers([mockUser1, mockUser2])
    })

    expect(result.current.users).toHaveLength(2)

    act(() => {
      result.current.removeUser(1)
    })

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0]).toEqual(mockUser2)
  })

  it('sets selected user', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.setSelectedUser(mockUser1)
    })

    expect(result.current.selectedUser).toEqual(mockUser1)
  })

  it('clears selected user when the user is removed', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.addUser(mockUser1)
      result.current.setSelectedUser(mockUser1)
    })

    expect(result.current.selectedUser).toEqual(mockUser1)

    act(() => {
      result.current.removeUser(1)
    })

    expect(result.current.selectedUser).toBeNull()
  })

  it('keeps selected user when a different user is removed', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.setUsers([mockUser1, mockUser2])
      result.current.setSelectedUser(mockUser1)
    })

    expect(result.current.selectedUser).toEqual(mockUser1)

    act(() => {
      result.current.removeUser(2) // Remove user2, not the selected user1
    })

    expect(result.current.selectedUser).toEqual(mockUser1)
    expect(result.current.users).toHaveLength(1)
  })

  it('clears all users and selected user', () => {
    const { result } = renderHook(() => useUserStore())
    
    act(() => {
      result.current.setUsers([mockUser1, mockUser2])
      result.current.setSelectedUser(mockUser1)
    })

    expect(result.current.users).toHaveLength(2)
    expect(result.current.selectedUser).toEqual(mockUser1)

    act(() => {
      result.current.clearUsers()
    })

    expect(result.current.users).toEqual([])
    expect(result.current.selectedUser).toBeNull()
  })
})
