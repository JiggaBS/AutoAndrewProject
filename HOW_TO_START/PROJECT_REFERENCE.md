# 📚 Complete Project Reference Guide

**One file to understand everything about this project**

---

## 🎯 What This Web App Does

A **complete car dealership platform** that automatically integrates vehicle inventory through **Multigestionale API**.

### Core Features
- ✅ **Automatic Vehicle Inventory** - Syncs vehicles from Multigestionale API
- ✅ **Advanced Search & Filters** - Brand, model, price, fuel type, transmission, etc.
- ✅ **Vehicle Details** - Complete specs, image gallery, financing calculator
- ✅ **Car Valuation System** - Customers can request vehicle valuations
- ✅ **Real-time Messaging** - Chat between customers and admin with file attachments
- ✅ **Admin Dashboard** - Manage requests, analytics, statistics
- ✅ **Customer Accounts** - User profiles, saved vehicles, request tracking
- ✅ **Multi-language** - Italian/English support
- ✅ **SEO Optimized** - Dynamic meta tags, structured data
- ✅ **Mobile Responsive** - Works on all devices

### Main Pages
- `/` - Homepage with hero, latest arrivals, services
- `/listings` - All vehicles with advanced filters
- `/vehicle/:id` - Individual vehicle details
- `/valutiamo` - Car valuation form
- `/contatti` - Contact information and form
- `/blog` - Blog page
- `/faq` - Frequently Asked Questions
- `/privacy-policy` - Privacy Policy
- `/cookie-policy` - Cookie Policy
- `/terms` - Terms & Conditions
- `/traccia-richiesta` - Track valuation request by code
- `/auth` - Login/Register (Email + Google OAuth)
- `/dashboard` - Customer area (saved vehicles, requests, profile)
- `/dashboard/requests/:id` - Customer request detail with chat
- `/admin` - Admin dashboard (requires admin role)
- `/admin/requests/:id` - Admin request detail with chat

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.9.3 | Type Safety |
| **Vite** | 7.3.0 | Build Tool & Dev Server |
| **React Router** | 6.30.1 | Client-side Routing |
| **TanStack Query** | 5.83.0 | Data Fetching & Caching |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS |
| **shadcn/ui** | Latest | UI Component Library |
| **React Hook Form** | 7.61.1 | Form Management |
| **Zod** | 3.25.76 | Schema Validation |
| **Zustand** | 4.5.0 | Client State Management |

### Backend (Supabase)
| Service | Purpose |
|---------|---------|
| **PostgreSQL** | Relational database |
| **Supabase Auth** | Authentication (Email, Google OAuth) |
| **Edge Functions** | Serverless backend (Deno) |
| **Storage** | File storage for message attachments |
| **RLS (Row Level Security)** | Database security policies |
| **Realtime** | Real-time subscriptions for messages |

### External Services
- **Multigestionale API** - Vehicle inventory data
- **Google Analytics** - Usage analytics
- **Resend** - Email notifications (optional)
- **Sentry** - Error tracking (optional)
- **Vercel** - Deployment platform

---

## 🔐 Google Authentication Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Identity Services API**
4. Configure **OAuth consent screen**:
   - Choose "External"
   - Fill app name, support email
   - Save and continue through all steps
5. Create **OAuth 2.0 Credentials**:
   - Type: "Web application"
   - **Authorized JavaScript origins**:
     ```
     https://YOUR_PROJECT_REF.supabase.co
     http://localhost:8085
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     http://localhost:8085/auth/v1/callback
     https://yourdomain.com/auth/v1/callback
     ```
6. **Copy and save**:
   - Client ID (format: `123456789-xxx.apps.googleusercontent.com`)
   - Client Secret (format: `GOCSPX-xxx`)

### Step 2: Configure Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Enable **Google** provider
3. Enter:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
4. Save

### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Development: `http://localhost:8085`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   ```
   http://localhost:8085/**
   https://yourdomain.com/**
   https://*.vercel.app/**
   ```

### Step 4: Test

1. Start dev server: `npm run dev`
2. Navigate to `/auth`
3. Click "Continue with Google"
4. Should redirect to Google sign-in, then back to app

**Troubleshooting:**
- `redirect_uri_mismatch` → Check redirect URIs match exactly
- `invalid_client` → Verify Client ID/Secret in Supabase
- No redirect → Check URL Configuration in Supabase

---

## 📊 Google Analytics Setup

### Method 1: Environment Variable (Recommended for Production)

Add to `.env` file:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://yourdomain.com
```

### Method 2: Edge Function (Dynamic Configuration)

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Add secret: `GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
3. The `public-config` edge function will return this value
4. App automatically uses it (no rebuild needed)

### How to Get Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create property or select existing
3. **Admin** → **Data Streams** → Select web stream
4. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

### What Gets Tracked

- ✅ Page views (automatic)
- ✅ Vehicle detail views
- ✅ Search events
- ✅ Form submissions
- ✅ WhatsApp clicks
- ✅ Save/unsave vehicle
- ✅ Share events

### Verify Setup

1. Go to Google Analytics → **Reports** → **Realtime**
2. Navigate your site
3. Should see visits in real-time

**Note:** In development, if `VITE_GA_MEASUREMENT_ID` is not set, only a console warning appears (app still works).

---

## 🗄️ Database Migrations

### Quick Setup

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql`
3. Copy entire file content
4. Paste and run in SQL Editor
5. Wait for "DATABASE SETUP COMPLETE!" message

### What Gets Created

**Tables (7):**
- `user_profiles` - Extended user information
- `user_roles` - Role assignments (admin/user)
- `app_settings` - Application configuration
- `saved_vehicles` - User saved vehicles
- `valuation_requests` - Car valuation submissions
- `valuation_messages` - Chat messages
- `activity_log` - Admin activity tracking

**Functions (9):**
- `get_user_role()` - Get user's role
- `has_role()` - Check user role
- `get_user_email()` - Get user email
- `user_owns_valuation_request()` - Check ownership
- `valuation_request_is_pending()` - Check status
- `send_valuation_message()` - Send message via RPC
- `mark_thread_read()` - Mark messages as read
- `insert_system_message()` - Admin system messages
- `handle_new_user()` - Auto-create profile on signup

**Security:**
- ✅ Row Level Security (RLS) on all tables
- ✅ 26 RLS policies
- ✅ Role-based access control

**Realtime:**
- ✅ `valuation_messages` - Real-time chat
- ✅ `valuation_requests` - Real-time status updates

**Storage:**
- ✅ `chat-attachments` bucket for message files (created automatically by migration)

### After Migration

**1. Create Admin User:**
```sql
-- Get user ID from Supabase Dashboard → Authentication → Users
UPDATE user_roles 
SET role = 'admin'
WHERE user_id = 'USER_UUID_HERE';
```

Or use script: `HOW_TO_START/scripts/create-admin-user.sql`

**2. Verify Storage Bucket:**
- Go to **Supabase Dashboard** → **Storage**
- Should see `chat-attachments` bucket (created automatically by migration)
- If missing, create it manually:
  - Name: `chat-attachments` (EXACT name, case-sensitive)
  - Public: ❌ **UNCHECKED** (must be private!)
  - File size limit: `10485760` (10MB)
  - Allowed MIME types: `image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*`

**3. Verify:**
- Sign up a test user
- Check `user_profiles` and `user_roles` are auto-created
- Test login/logout

---

## 🚀 Edge Functions Deployment

### Required Functions (3)

1. **`fetch-vehicles`** - Fetches vehicle data from Multigestionale API
   - **MUST DEPLOY** - App won't show vehicles without this

2. **`submit-valuation`** - Handles car valuation form submissions
   - **MUST DEPLOY** - Valuation form won't work without this

3. **`public-config`** - Returns public configuration (Supabase URL, keys, GA ID)
   - **MUST DEPLOY** - Some features may break without this

### Optional Functions (2)

4. **`notify-client`** - Sends email notifications to clients
   - **OPTIONAL** - Only if you want email notifications

5. **`notify-admin`** - Sends email notifications to admin
   - **OPTIONAL** - Only if you want email notifications

### Deployment Methods

#### Method 1: Automated Script (Recommended)

```bash
npm run deploy:functions
```

Or:
```bash
node HOW_TO_START/scripts/deploy-edge-functions.js
```

#### Method 2: Manual CLI

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy public-config
supabase functions deploy notify-client
supabase functions deploy notify-admin
```

#### Method 3: Supabase Dashboard

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **"Create a new function"**
3. Enter function name (e.g., `fetch-vehicles`)
4. Copy code from `supabase/functions/fetch-vehicles/index.ts`
5. Paste and deploy

### Required Secrets

After deploying, add secrets in **Supabase Dashboard** → **Edge Functions** → **Secrets**:

**Required:**
- `ALLOWED_ORIGINS` - Comma-separated origins (e.g., `http://localhost:8085,https://yourdomain.com`) - **REQUIRED for production!**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (from Supabase Settings → API)

**Optional (but recommended):**
- `MULTIGESTIONALE_API_KEY` - Your Multigestionale API key (for `fetch-vehicles`) - App works with sample data if not set

**Optional (for email functions):**
- `RESEND_API_KEY` - Resend API key (for `notify-client` and `notify-admin`)
- `DEALER_EMAIL` - Dealer email address
- `ADMIN_EMAIL` - Admin email address

**Optional (for public-config function):**
- `GA_MEASUREMENT_ID` - Google Analytics ID (Note: Edge function also checks `VITE_GA_MEASUREMENT_ID` from environment)

### Verify Deployment

1. Check **Supabase Dashboard** → **Edge Functions** (should see all 5 functions)
2. Test in app - vehicles should load, forms should work
3. Check logs: `supabase functions logs fetch-vehicles`

---

## ⚙️ Environment Variables

### Local Development (`.env` file)

Create `.env` in project root:

```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
# Alternative: VITE_SUPABASE_ANON_KEY (same value, different name)
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF

# Google Analytics (OPTIONAL)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://yourdomain.com  # Used for SEO structured data

# Sentry Error Tracking (OPTIONAL)
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENABLE_IN_DEV=false  # Set to "true" to enable Sentry in development
VITE_APP_VERSION=1.0.0  # Optional: App version for Sentry releases
```

**Where to find:**
- Supabase URL/Keys: **Supabase Dashboard** → **Settings** → **API**
  - `VITE_SUPABASE_PUBLISHABLE_KEY` = "anon" or "public" key
  - Alternative: `VITE_SUPABASE_ANON_KEY` (same value)
- GA Measurement ID: **Google Analytics** → **Admin** → **Data Streams**
- Sentry DSN: **Sentry Dashboard** → **Settings** → **Projects** → **Client Keys (DSN)**

### Production (Vercel)

1. Go to **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. Add all variables from `.env` file
3. Redeploy after adding variables

**⚠️ Important:** Never commit `.env` file to Git!

---

## 🌐 Production Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure project settings

### Step 2: Set Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add all variables from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_GA_MEASUREMENT_ID` (optional)
   - `VITE_SENTRY_DSN` (optional)
3. Select **Production**, **Preview**, and **Development** for each
4. Click **Save**

### Step 3: Deploy

1. Push to your main branch (Vercel auto-deploys)
2. Or use CLI: `npx vercel --prod`
3. Wait for deployment to complete

### Step 4: Update Supabase Configuration

1. **Auth URLs:**
   - Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
   - Update **Site URL** to your Vercel URL: `https://your-project.vercel.app`
   - Add **Redirect URL**: `https://your-project.vercel.app/**`

2. **Edge Function Secrets:**
   - Go to **Edge Functions** → **Secrets**
   - Update `ALLOWED_ORIGINS` to include your Vercel URL:
     ```
     https://your-project.vercel.app,https://yourdomain.com
     ```

### Step 5: Test Production

1. Visit your Vercel URL
2. Test all features:
   - Homepage loads
   - User registration works
   - Login works
   - Admin dashboard accessible (if you're admin)
   - Vehicles load
   - Forms submit

---

## 📁 Project Structure

```
AutoAndrewProject/
├── src/
│   ├── pages/              # Route pages
│   ├── components/         # React components
│   ├── features/           # Feature modules
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, API clients
│   ├── contexts/           # React contexts
│   └── integrations/       # External integrations
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── HOW_TO_START/          # Setup documentation
└── public/                # Static assets
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy edge functions
npm run deploy:functions

# Run linter
npm run lint
```

---

## 🔍 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **"Cannot find module"** | Run `npm install` |
| **"Missing environment variables"** | Check `.env` file exists and has correct values |
| **"CORS errors"** | Add origin to `ALLOWED_ORIGINS` in Edge Function secrets |
| **"RLS policy violation"** | Run database migration (`HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql`) |
| **"Function not found (404)"** | Deploy edge functions |
| **"API key not configured"** | Add `MULTIGESTIONALE_API_KEY` secret |
| **Vehicles not loading** | Deploy `fetch-vehicles` edge function |
| **Google Auth not working** | Check redirect URIs match exactly in Google Console |

---

## 📝 Important Files Reference

| File | Purpose |
|------|---------|
| `HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql` | Complete database migration (run once) |
| `HOW_TO_START/scripts/deploy-edge-functions.js` | Automated edge function deployment |
| `HOW_TO_START/scripts/create-admin-user.sql` | Create admin user SQL |
| `HOW_TO_START/templates/env.example` | Environment variables template |
| `HOW_TO_START/templates/edge-functions-secrets.txt` | Edge function secrets template |
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |

---

## ✅ Setup Checklist

### Initial Setup
- [ ] Node.js 24.x installed
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database migration run (`HOW_TO_START/database/COMPLETE_DATABASE_SETUP.sql`)
- [ ] Edge functions deployed (all 5)
- [ ] Edge function secrets configured
- [ ] `.env` file created with Supabase credentials
- [ ] Admin user created
- [ ] Google OAuth configured (optional)
- [ ] Google Analytics configured (optional)

### Production Deployment
- [ ] Environment variables set in Vercel
- [ ] Google OAuth redirect URIs updated for production
- [ ] Google Analytics configured
- [ ] Domain configured in Vercel
- [ ] SSL certificate active
- [ ] Test all features in production

---

## 📚 Additional Resources

All essential information is in this file. For more details on specific topics, check:
- **Templates**: `HOW_TO_START/templates/` - Environment and secrets templates
- **Scripts**: `HOW_TO_START/scripts/` - Deployment and admin scripts

---

**Last Updated:** December 2025  
**Version:** 1.0.0
