import '@testing-library/jest-dom'
import { server } from '@/mocks/server'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'

// Start the mock server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Clean up after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close the server after all tests
afterAll(() => {
  server.close()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
vi.mock('process', () => ({
  env: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_API_URL: 'https://jsonplaceholder.typicode.com',
  },
}))

// Mock window.localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
