/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for S3/CloudFront deployment
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },

  // Remove asset prefix to work with S3/CloudFront
  // assetPrefix: '',
  
  // Ensure all routes are client-side
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
  }
}

module.exports = nextConfig
