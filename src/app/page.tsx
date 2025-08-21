'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to My App
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          A modern client-side application built with Next.js 15, TypeScript, Zustand, 
          and NextUI. Fully deployable to AWS S3 + CloudFront.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">🚀 Modern Stack</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Built with Next.js 15, TypeScript, Zustand for state management, 
              and NextUI for beautiful components.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">🔐 Authentication</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Complete auth flow with sign up, sign in, forgot password, 
              and protected routes using local storage.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">☁️ Cloud Ready</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Configured for static export and deployment to AWS S3 + CloudFront 
              with proper routing support.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
        <p className="text-gray-600">
          Create an account or sign in to access your dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button color="primary" size="lg">
              Sign Up
            </Button>
          </Link>
          <Link href="/signin">
            <Button variant="bordered" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
