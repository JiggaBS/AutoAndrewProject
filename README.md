# AutoGroup Romagna - Car Dealership Web Application

## Project Overview

This is a professional car dealership web application built for Italian automotive dealers. It integrates with the Multigestionale API to automatically display and manage vehicle inventory.

## Technologies

This project is built with:

- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Backend (Database, Auth, Edge Functions)
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun
- Git

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The development server will start on `http://localhost:8085`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Editing the Code

You can edit this project using:

- **Your preferred IDE** - Clone the repo and work locally
- **GitHub** - Edit files directly in the GitHub web interface
- **GitHub Codespaces** - Use the cloud-based development environment

## Deployment

This project is configured for deployment on **Vercel**.

### Deploy to Vercel

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Push to your main branch - Vercel will auto-deploy

### Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY` - Your Supabase publishable key

Optional:
- `VITE_GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `VITE_SENTRY_DSN` - Sentry error tracking DSN

See `HOW_TO_START/docs/DEPLOYMENT_READINESS.md` for complete deployment instructions.

## Documentation

For complete documentation, see:
- `FULL_DOCUMENTATION.md` - Complete project documentation
- `HOW_TO_START/` - Setup guides and documentation

## License

Private project
