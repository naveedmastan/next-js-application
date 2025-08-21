'use client'

import { AuthGuard } from '@/components/AuthGuard'
import { useAuthStore } from '@/store/authStore'
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button color="danger" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Welcome Back!</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Stats</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <p><strong>Total Logins:</strong> 42</p>
                <p><strong>Last Login:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Account Status:</strong> <span className="text-green-600">Active</span></p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <p>• Logged in successfully</p>
                <p>• Viewed dashboard</p>
                <p>• Updated profile settings</p>
                <p>• Changed password</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Application Features</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-gray-600">
                This is a fully client-side React application built with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Next.js 15 with App Router</li>
                <li>TypeScript for type safety</li>
                <li>Zustand for state management</li>
                <li>NextUI for beautiful components</li>
                <li>Tailwind CSS for styling</li>
                <li>Client-side authentication with local storage</li>
                <li>Static export ready for S3 + CloudFront deployment</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </AuthGuard>
  )
}