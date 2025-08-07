'use client'

import { ContactForm } from '@/components/forms/ContactForm'
import { UsersList } from '@/components/data/UsersList'
import { useUserStore } from '@/store/userStore'

export default function HomePage() {
  const { users, selectedUser, setSelectedUser } = useUserStore()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to React TypeScript SPA
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          A full-featured application built with React 18, TypeScript, Next.js, TailwindCSS, 
          and modern development tools.
        </p>
      </div>

      {/* Demo Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form Demo */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Form Demo
          </h2>
          <p className="text-gray-600 mb-6">
            Demonstrates React Hook Form with validation and TypeScript integration.
          </p>
          <ContactForm />
        </div>

        {/* Users List Demo */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Users Data Demo
          </h2>
          <p className="text-gray-600 mb-6">
            Shows React Query for data fetching and Zustand for state management.
          </p>
          <UsersList />
        </div>
      </div>

      {/* Current State Display */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-primary-900 mb-2">
          Current Application State
        </h3>
        <div className="text-sm text-primary-700">
          <p>Users in store: {users.length}</p>
          <p>Selected user: {selectedUser ? selectedUser.name : 'None'}</p>
        </div>
      </div>
    </div>
  )
}
