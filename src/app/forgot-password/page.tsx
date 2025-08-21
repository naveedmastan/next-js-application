'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardBody, CardHeader, Link } from '@nextui-org/react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { forgotPassword, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const router = useRouter()

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
    const success = await forgotPassword({ email })
    if (success) {
      setIsSubmitted(true)
    }
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
          </CardHeader>
          <CardBody>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Link href="/signin">
                <Button color="primary" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link href="/signin" className="text-primary-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}