export const validateRequired = (message: string) => (value: any) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return message
  }
  return true
}

export const validateEmail = (value: string) => {
  if (!value) return true // Let required validator handle empty values
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Please enter a valid email address'
}

export const validateMinLength = (min: number, message?: string) => (value: string) => {
  if (!value) return true // Let required validator handle empty values
  
  return value.length >= min || message || `Must be at least ${min} characters`
}

export const validateMaxLength = (max: number, message?: string) => (value: string) => {
  if (!value) return true
  
  return value.length <= max || message || `Must be no more than ${max} characters`
}

export const validatePhone = (value: string) => {
  if (!value) return true
  
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(value) || 'Please enter a valid phone number'
}

export const validateUrl = (value: string) => {
  if (!value) return true
  
  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a valid URL'
  }
}

export const validatePattern = (pattern: RegExp, message: string) => (value: string) => {
  if (!value) return true
  
  return pattern.test(value) || message
}

// Composite validation
export const validateField = (validators: Array<(value: any) => string | true>) => (value: any) => {
  for (const validator of validators) {
    const result = validator(value)
    if (result !== true) {
      return result
    }
  }
  return true
}
