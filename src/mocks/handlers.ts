import { http, HttpResponse } from 'msw'
import { User } from '@/types/user'

// Mock users data
const mockUsers: User[] = [
  {
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
  },
  {
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
  },
  {
    id: 3,
    name: 'Bob Johnson',
    username: 'bob.johnson',
    email: 'bob.johnson@example.com',
    phone: '+1-555-0789',
    website: 'bobjohnson.net',
    address: {
      street: '789 Pine Rd',
      suite: '',
      city: 'Elsewhere',
      zipcode: '54321',
      geo: { lat: '41.8781', lng: '-87.6298' }
    },
    company: {
      name: 'Johnson & Associates',
      catchPhrase: 'Quality first',
      bs: 'business consulting'
    }
  }
]

// API handlers
export const handlers = [
  // Get all users
  http.get('https://jsonplaceholder.typicode.com/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  // Get user by ID
  http.get('https://jsonplaceholder.typicode.com/users/:id', ({ params }) => {
    const { id } = params
    const user = mockUsers.find(u => u.id === Number(id))
    
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(user)
  }),

  // Create user
  http.post('https://jsonplaceholder.typicode.com/users', async ({ request }) => {
    const newUser = await request.json() as Omit<User, 'id'>
    const user: User = {
      ...newUser,
      id: Math.max(...mockUsers.map(u => u.id)) + 1
    }
    
    mockUsers.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),

  // Update user
  http.put('https://jsonplaceholder.typicode.com/users/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json() as Partial<User>
    const userIndex = mockUsers.findIndex(u => u.id === Number(id))
    
    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    return HttpResponse.json(mockUsers[userIndex])
  }),

  // Delete user
  http.delete('https://jsonplaceholder.typicode.com/users/:id', ({ params }) => {
    const { id } = params
    const userIndex = mockUsers.findIndex(u => u.id === Number(id))
    
    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockUsers.splice(userIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Search users
  http.get('https://jsonplaceholder.typicode.com/users/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase() || ''
    
    const filteredUsers = mockUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    )
    
    return HttpResponse.json(filteredUsers)
  }),

  // Simulate network delay for testing
  http.get('*/slow-endpoint', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return HttpResponse.json({ message: 'Slow response' })
  }),

  // Error simulation
  http.get('*/error-endpoint', () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }),
]
