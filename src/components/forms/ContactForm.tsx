'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateEmail, validateRequired } from '@/utils/validation'
import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    mode: 'onChange'
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', data)
      setSubmitSuccess(true)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name', {
          validate: validateRequired('Name is required')
        })}
        error={errors.name?.message}
        placeholder="Enter your name"
      />

      <Input
        label="Email"
        type="email"
        {...register('email', {
          validate: (value) => validateRequired('Email is required')(value) || validateEmail(value)
        })}
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <div>
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="form-input resize-none"
          placeholder="Enter your message"
          {...register('message', {
            validate: validateRequired('Message is required')
          })}
        />
        {errors.message && (
          <p className="form-error">{errors.message.message}</p>
        )}
      </div>

      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            Thank you! Your message has been sent successfully.
          </p>
        </div>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
