'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardBody, CardHeader, Link } from '@nextui-org/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const toggleVisibility = () => setIsVisible(!isVisible)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) {
      router.push('/dashboard')
    }
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="bordered"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="bordered"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm">
              <Link href="/forgot-password" className="text-primary-600 hover:underline">
                Forgot your password?
              </Link>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
              <p className="text-xs text-blue-700">Email: demo@example.com</p>
              <p className="text-xs text-blue-700">Password: password123</p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}