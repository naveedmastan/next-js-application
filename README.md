# My App - Next.js 15 with Authentication

A modern, fully client-side React application built with Next.js 15, TypeScript, Zustand, and NextUI. Features complete authentication flow and is optimized for static deployment to AWS S3 + CloudFront.

## 🚀 Features

- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Zustand** for lightweight state management
- **NextUI** for beautiful, accessible UI components
- **Tailwind CSS** for utility-first styling
- **Client-side authentication** with local storage persistence
- **Protected routes** with auth guards
- **Static export** ready for S3 + CloudFront deployment
- **Client-side routing** that works with direct URL access

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Library**: NextUI (HeroUI)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Forms**: React Hook Form
- **Build Tool**: Next.js built-in
- **Testing**: Vitest + Testing Library

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── forgot-password/   # Forgot password page
│   ├── dashboard/         # Protected dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── providers.tsx     # App providers
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── Navigation.tsx    # Navigation header
│   └── AuthGuard.tsx     # Route protection
├── store/                # Zustand stores
│   ├── authStore.ts      # Authentication store
│   └── userStore.ts      # User data store
└── types/                # TypeScript type definitions
    └── auth.ts           # Auth-related types
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing the authentication flow:
- **Email**: demo@example.com
- **Password**: password123

## 🔐 Authentication Flow

The application includes a complete authentication system:

- **Sign Up**: Create new accounts with email/password
- **Sign In**: Login with existing credentials
- **Forgot Password**: Password reset flow (mock implementation)
- **Protected Routes**: Dashboard requires authentication
- **Persistent Sessions**: Auth state persisted in local storage
- **Auto Redirect**: Automatic navigation based on auth status

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory.

### Deploy to AWS S3 + CloudFront

See [aws-deployment.md](./aws-deployment.md) for detailed deployment instructions.

Quick deployment:
1. Update bucket name in `deploy-to-aws.sh`
2. Run: `./deploy-to-aws.sh`

## 🔧 Configuration

### Next.js Configuration

The `next.config.js` is configured for:
- Static export (`output: 'export'`)
- Client-side only rendering
- Proper asset handling for S3/CloudFront
- Trailing slash handling for consistent routing

### Environment Variables

Create a `.env.local` file for local development:
```
NEXT_PUBLIC_API_URL=your-api-url
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server (not needed for static export)
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🌐 Routes

- `/` - Home page (redirects to dashboard if authenticated)
- `/signin` - Sign in page
- `/signup` - Sign up page  
- `/forgot-password` - Password reset page
- `/dashboard` - Protected dashboard (requires authentication)

## 🔒 Security Notes

- Authentication is mock/demo implementation using local storage
- For production, replace with proper backend authentication
- Implement proper password hashing and validation
- Use secure HTTP-only cookies instead of local storage for production
- Add rate limiting and CSRF protection

## 📝 License

MIT License - feel free to use this project as a starting point for your applications.