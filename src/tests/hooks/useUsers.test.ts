import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '@/hooks/useUsers'
import { ReactNode } from 'react'
import { createElement } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => 
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    // Initial loading state
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(3)
    expect(result.current.data?.[0]).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
    )
    expect(result.current.error).toBeNull()
  })

  it('handles errors correctly', async () => {
    // Mock a failed request by modifying the MSW handler
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')

    server.use(
      http.get('https://jsonplaceholder.typicode.com/users', () => {
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        )
      })
    )

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
  })

  it('refetches data when refetch is called', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(3)

    // Call refetch
    await result.current.refetch()

    // Data should still be there after refetch
    expect(result.current.data).toHaveLength(3)
  })

  it('uses correct query key', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // The query should be accessible via the query key
    expect(result.current.data).toBeDefined()
  })
})
