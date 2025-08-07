mport { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import _ from 'lodash'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format functions
export const formatDate = (date: Date | string | number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date: Date | string | number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// String utilities
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (str: string, length: number, suffix = '...') => {
  return str.length <= length ? str : str.slice(0, length) + suffix
}

// Array utilities using Lodash
export const groupBy = <T>(array: T[], key: keyof T) => {
  return _.groupBy(array, key)
}

export const orderBy = <T>(array: T[], keys: string | string[], orders?: 'asc' | 'desc' | ('asc' | 'desc')[]) => {
  return _.orderBy(array, keys, orders)
}

export const uniqBy = <T>(array: T[], key: keyof T) => {
  return _.uniqBy(array, key)
}

export const chunk = <T>(array: T[], size: number) => {
  return _.chunk(array, size)
}

// Object utilities
export const pick = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return _.pick(obj, keys) as Pick<T, K>
}

export const omit = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return _.omit(obj, keys) as Omit<T, K>
}

export const isEmpty = (value: any) => {
  return _.isEmpty(value)
}

// Async utilities
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: _.DebounceSettings
) => {
  return _.debounce(func, wait, options)
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: _.ThrottleSettings
) => {
  return _.throttle(func, wait, options)
}

// Type guards
export const isString = (value: any): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export const isArray = <T>(value: any): value is T[] => {
  return Array.isArray(value)
}

export const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return
    window.localStorage.clear()
  },
}
