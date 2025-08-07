** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SPA mode - disable server-side rendering
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },

  // Configure for client-side only
  experimental: {
    appDir: true
  },

  // Asset prefix for static hosting
  assetPrefix: process.env.NODE_ENV === 'production' ? '/app' : '',

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  }
}

module.exports = nextConfig
