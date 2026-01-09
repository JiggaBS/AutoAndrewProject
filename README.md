# AutoGroup Romagna - Car Dealership Web Application

## Project Overview

This is a professional car dealership web application built for Italian automotive dealers. It integrates with the **Multigestionale API** to automatically display and manage vehicle inventory.

### Key Features

- ✅ Automatic vehicle inventory from API
- ✅ Advanced search and filters
- ✅ Vehicle comparison tool
- ✅ Financing calculator
- ✅ Real-time messaging between customers and admin
- ✅ Admin dashboard with analytics
- ✅ Customer accounts and saved vehicles
- ✅ Multi-language support (Italian/English)
- ✅ SEO optimized
- ✅ Mobile responsive

---

## 🎯 Quick Start

### Prerequisites

- Node.js 24.x
- npm or bun
- Supabase account (free)

### Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Create .env file (see templates/env.example)
cp HOW_TO_START/templates/env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

The development server will start on `http://localhost:8085`

---

## 📚 Documentation

### 👉 **START HERE: Complete Reference**

**[HOW_TO_START/PROJECT_REFERENCE.md](HOW_TO_START/PROJECT_REFERENCE.md)** - **ONE FILE with everything you need:**
- What the app does
- Complete tech stack
- Google Auth setup
- Google Analytics setup
- Database migrations
- Edge function deployments
- Quick reference for everything

**Perfect if you haven't used this project in a while and need to refresh your memory!**

### Additional Resources

All essential information is in `PROJECT_REFERENCE.md`. For templates and scripts:
- **Templates**: `HOW_TO_START/templates/` - Environment and secrets templates
- **Scripts**: `HOW_TO_START/scripts/` - Deployment and admin scripts

---

## 🛠️ Technologies

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions, Storage) |
| **State** | TanStack Query, Zustand |
| **Deployment** | Vercel |

---

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run deploy:functions` | Deploy all edge functions to Supabase |

---

## ⚙️ Environment Variables

### Required (`.env` file)

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```

### Optional

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Google Analytics
VITE_SENTRY_DSN=https://...@...sentry.io/...  # Error tracking
```

**Templates:** See `HOW_TO_START/templates/env.example` for complete template

---

## 🗄️ Database Setup

1. **Run migration:**
   - Open `HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql`
   - Copy and run in Supabase Dashboard → SQL Editor

2. **Create admin user:**
   - Register a user in the app
   - Get user UUID from Supabase Dashboard → Authentication → Users
   - Run: `HOW_TO_START/scripts/create-admin-user.sql` (update UUID first)

---

## 🚀 Edge Functions Deployment

### Quick Deploy (Automated)

```bash
npm run deploy:functions
```

### Manual Deploy

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy public-config
supabase functions deploy notify-client
supabase functions deploy notify-admin
```

**Required Secrets:** See `HOW_TO_START/templates/edge-functions-secrets.txt`

---

## 🌐 Deployment

### Deploy to Vercel

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Push to main branch - Vercel auto-deploys

**See [HOW_TO_START/PROJECT_REFERENCE.md](HOW_TO_START/PROJECT_REFERENCE.md) for complete deployment guide**

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| **"Cannot find module"** | Run `npm install` |
| **"Missing environment variables"** | Check `.env` file exists and has correct values |
| **"CORS errors"** | Add your domain to `ALLOWED_ORIGINS` in Supabase Edge Functions secrets |
| **"RLS policy violation"** | Run database migration (`HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql`) |
| **"Function not found (404)"** | Deploy edge functions |
| **"API key not configured"** | Add `MULTIGESTIONALE_API_KEY` secret in Supabase |

**Full troubleshooting:** See [HOW_TO_START/PROJECT_REFERENCE.md](HOW_TO_START/PROJECT_REFERENCE.md)

---

## 📁 Project Structure

```
AutoAndrewProject/
├── src/                    # React application
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── HOW_TO_START/          # Setup documentation
│   ├── PROJECT_REFERENCE.md  # ⭐ Complete reference
│   ├── templates/          # Environment templates
│   └── scripts/            # Deployment scripts
└── README.md              # This file
```

---

## 📝 Important Notes

- ⚠️ **Never commit `.env` file to Git** - it contains secrets!
- ⚠️ **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - never expose it
- ✅ **All guides are beginner-friendly** - no programming experience needed

---

## 📖 Next Steps

1. **Read:** [HOW_TO_START/PROJECT_REFERENCE.md](HOW_TO_START/PROJECT_REFERENCE.md) - Complete reference guide
2. **Setup:** Follow the setup checklist in PROJECT_REFERENCE.md
3. **Deploy:** Use the deployment guide in PROJECT_REFERENCE.md

---

**Last Updated:** December 2025  
**Version:** 2.2.0
