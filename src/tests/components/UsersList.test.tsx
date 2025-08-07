import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UsersList } from '@/components/data/UsersList'
import { useUserStore } from '@/store/userStore'

// Mock the store
vi.mock('@/store/userStore')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('UsersList', () => {
  const mockStore = {
    selectedUser: null,
    setSelectedUser: vi.fn(),
    addUser: vi.fn(),
  }

  beforeEach(() => {
    vi.mocked(useUserStore).mockReturnValue(mockStore)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    render(<UsersList />, { wrapper: createWrapper() })
    
    expect(screen.getByText(/loading users.../i)).toBeInTheDocument()
  })

  it('displays users after loading', async () => {
    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  it('shows user count in header', async () => {
    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/users \(3\)/i)).toBeInTheDocument()
    })
  })

  it('allows selecting a user', async () => {
    const user = userEvent.setup()
    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const userCard = screen.getByText('John Doe').closest('div')
    await user.click(userCard!)

    expect(mockStore.setSelectedUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    )
  })

  it('allows adding user to store', async () => {
    const user = userEvent.setup()
    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const addButton = screen.getAllByText(/add to store/i)[0]
    await user.click(addButton)

    expect(mockStore.addUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    )
  })

  it('displays selected user details', async () => {
    const selectedUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      website: 'johndoe.com',
      username: 'john.doe',
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

    vi.mocked(useUserStore).mockReturnValue({
      ...mockStore,
      selectedUser,
    })

    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Selected User')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      expect(screen.getByText('+1-555-0123')).toBeInTheDocument()
      expect(screen.getByText('johndoe.com')).toBeInTheDocument()
    })
  })

  it('shows refresh button and allows refetching', async () => {
    const user = userEvent.setup()
    render(<UsersList />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/refresh/i)).toBeInTheDocument()
    })

    const refreshButton = screen.getByText(/refresh/i)
    await user.click(refreshButton)

    // The button should be clickable (not disabled during refetch due to our mock setup)
    expect(refreshButton).toBeEnabled()
  })
})
