# 🚀 COMPLETE SETUP GUIDE - ENGLISH

**Welcome!** This guide will help you set up and run this project from scratch, even if you're a complete beginner.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install Required Software](#2-step-1-install-required-software)
3. [Step 2: Create Supabase Account & Project](#3-step-2-create-supabase-account--project)
4. [Step 3: Set Up Database (Migrations)](#4-step-3-set-up-database-migrations)
5. [Step 4: Configure Storage Bucket](#5-step-4-configure-storage-bucket)
6. [Step 5: Set Up Authentication](#6-step-5-set-up-authentication)
7. [Step 6: Deploy Edge Functions](#7-step-6-deploy-edge-functions)
8. [Step 7: Configure Environment Variables](#8-step-7-configure-environment-variables)
9. [Step 8: Install Project Dependencies](#9-step-8-install-project-dependencies)
10. [Step 9: Run the Project Locally](#10-step-9-run-the-project-locally)
11. [Step 10: Create Admin User](#11-step-10-create-admin-user)
12. [Step 11: Deploy to Production (Vercel)](#12-step-11-deploy-to-production-vercel)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. PREREQUISITES

Before starting, make sure you have:
- A computer (Windows, Mac, or Linux)
- Internet connection
- An email address
- Basic computer skills (opening files, copying text)

**You DON'T need:**
- Programming experience
- Database knowledge
- Server management skills

---

## 2. STEP 1: INSTALL REQUIRED SOFTWARE

### 2.1 Install Node.js

1. **Go to:** https://nodejs.org/
2. **Download:** Click the "LTS" (Long Term Support) version button
3. **Install:** Run the downloaded file and follow the installation wizard
4. **Verify:** Open a terminal/command prompt and type:
   ```bash
   node --version
   ```
   You should see something like `v20.x.x` or `v18.x.x`

### 2.2 Install Git (Optional but Recommended)

1. **Go to:** https://git-scm.com/downloads
2. **Download:** Choose your operating system
3. **Install:** Run the installer with default settings
4. **Verify:** Open terminal and type:
   ```bash
   git --version
   ```

### 2.3 Install Supabase CLI (For Edge Functions)

1. **Open terminal/command prompt**
2. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```
   Or on Mac/Linux:
   ```bash
   brew install supabase/tap/supabase
   ```
3. **Verify:**
   ```bash
   supabase --version
   ```

---

## 3. STEP 2: CREATE SUPABASE ACCOUNT & PROJECT

### 3.1 Create Supabase Account

1. **Go to:** https://supabase.com/
2. **Click:** "Start your project" or "Sign up"
3. **Sign up** with your email or GitHub account
4. **Verify** your email if required

### 3.2 Create New Project

1. **Click:** "New Project" button
2. **Fill in the form:**
   - **Name:** Choose any name (e.g., "AutoAndrew")
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Start with "Free" plan
3. **Click:** "Create new project"
4. **Wait:** 2-3 minutes for project to be created

### 3.3 Get Your Project Credentials

1. **Go to:** Project Settings → API
2. **Copy these values** (you'll need them later):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (KEEP SECRET!)

**⚠️ IMPORTANT:** Save these in a text file for later use!

---

## 4. STEP 3: SET UP DATABASE (MIGRATIONS)

### 4.1 Open SQL Editor

1. **In Supabase Dashboard:** Click "SQL Editor" in the left sidebar
2. **Click:** "New query"

### 4.2 Run the Full Migration

1. **Open the file:** `HOW_TO_START/database/full_migration.sql`
2. **Copy ALL the content** (Ctrl+A, Ctrl+C)
3. **Paste** into the Supabase SQL Editor
4. **Click:** "Run" button (or press Ctrl+Enter)
5. **Wait:** 10-30 seconds for migration to complete
6. **Verify:** You should see "Success. No rows returned"

### 4.3 Verify Tables Were Created

1. **In Supabase Dashboard:** Click "Table Editor" in the left sidebar
2. **You should see these tables:**
   - `user_profiles`
   - `user_roles`
   - `app_settings`
   - `saved_vehicles`
   - `valuation_requests`
   - `valuation_messages`
   - `activity_log`

✅ **If you see all tables, database setup is complete!**

---

## 5. STEP 4: CONFIGURE STORAGE BUCKET

### 5.1 Create Storage Bucket

1. **In Supabase Dashboard:** Click "Storage" in the left sidebar
2. **Click:** "Create a new bucket"
3. **Fill in:**
   - **Name:** `message-attachments` (EXACT name, case-sensitive!)
   - **Public bucket:** ❌ **UNCHECKED** (must be private!)
4. **Click:** "Create bucket"

### 5.2 Configure Bucket Settings

1. **Click on** the `message-attachments` bucket
2. **Go to:** "Settings" tab
3. **Set:**
   - **File size limit:** `10485760` (10MB in bytes)
   - **Allowed MIME types:** 
     ```
     image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*
     ```
4. **Click:** "Save"

### 5.3 Verify Storage Policies

The migration should have created storage policies automatically. To verify:

1. **Go to:** Storage → Policies
2. **You should see policies for** `message-attachments` bucket
3. **If not, run this SQL** in SQL Editor:
   ```sql
   -- Check if policies exist
   SELECT * FROM storage.policies WHERE bucket_id = 'message-attachments';
   ```

✅ **Storage is now configured!**

---

## 6. STEP 5: SET UP AUTHENTICATION

### 6.1 Configure Auth URLs

1. **In Supabase Dashboard:** Go to Authentication → URL Configuration
2. **Set Site URL:**
   - For local development: `http://localhost:8085`
   - For production: `https://yourdomain.com`
3. **Add Redirect URLs:**
   ```
   http://localhost:8085/**
   https://yourdomain.com/**
   https://*.vercel.app/**
   ```
4. **Click:** "Save"

### 6.2 Enable Email Authentication (Optional)

1. **Go to:** Authentication → Providers
2. **Click:** "Email" provider
3. **Enable:** "Enable email provider"
4. **Configure email templates** (optional, uses default if not configured)

### 6.3 Enable Google OAuth (Optional)

1. **Go to:** Authentication → Providers
2. **Click:** "Google" provider
3. **Enable:** "Enable Google provider"
4. **Get credentials from Google Cloud Console:**
   - Go to https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Copy Client ID and Client Secret
5. **Paste** into Supabase Google provider settings
6. **Click:** "Save"

✅ **Authentication is now configured!**

---

## 7. STEP 6: DEPLOY EDGE FUNCTIONS

### 7.1 Install Supabase CLI (If Not Done)

```bash
npm install -g supabase
```

### 7.2 Login to Supabase

1. **Open terminal/command prompt**
2. **Run:**
   ```bash
   supabase login
   ```
3. **Follow instructions:** It will open a browser to authenticate
4. **Copy the access token** and paste it in the terminal

### 7.3 Link Your Project

1. **Get your project reference ID:**
   - In Supabase Dashboard → Settings → General
   - Copy the "Reference ID" (looks like: `abcdefghijklmnop`)
2. **In terminal, run:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF_ID
   ```
   Replace `YOUR_PROJECT_REF_ID` with your actual reference ID

### 7.4 Set Edge Function Secrets

1. **In Supabase Dashboard:** Go to Edge Functions → Secrets
2. **Add these secrets** (click "Add new secret" for each):

   **Required:**
   ```
   ALLOWED_ORIGINS = http://localhost:8085,https://yourdomain.com,https://*.vercel.app
   SUPABASE_URL = https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = YOUR_SERVICE_ROLE_KEY
   ```

   **Optional (but recommended):**
   ```
   MULTIGESTIONALE_API_KEY = your-api-key-here
   RESEND_API_KEY = your-resend-api-key
   DEALER_EMAIL = dealer@example.com
   ADMIN_EMAIL = admin@example.com
   ```

### 7.5 Deploy Each Edge Function

**Navigate to project root** (where `supabase` folder is located), then run:

```bash
# Deploy fetch-vehicles function
supabase functions deploy fetch-vehicles

# Deploy submit-valuation function
supabase functions deploy submit-valuation

# Deploy notify-admin function
supabase functions deploy notify-admin

# Deploy notify-client function
supabase functions deploy notify-client

# Deploy public-config function
supabase functions deploy public-config
```

**For each function:**
- Wait for "Deployed successfully" message
- If you see errors, check that you're logged in and project is linked

### 7.6 Verify Functions Are Deployed

1. **In Supabase Dashboard:** Go to Edge Functions
2. **You should see 5 functions:**
   - `fetch-vehicles`
   - `submit-valuation`
   - `notify-admin`
   - `notify-client`
   - `public-config`

✅ **Edge functions are now deployed!**

---

## 8. STEP 7: CONFIGURE ENVIRONMENT VARIABLES

### 8.1 Create `.env` File

1. **In your project root folder** (where `package.json` is located)
2. **Create a new file** named `.env` (no extension, just `.env`)
3. **Open it** in a text editor

### 8.2 Add Environment Variables

**Copy and paste this template**, then replace with your actual values:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF

# Google Analytics (OPTIONAL)
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking (OPTIONAL)
# VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Where to find these values:**
- `VITE_SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase Dashboard → Settings → API → anon/public key
- `VITE_SUPABASE_PROJECT_ID`: Supabase Dashboard → Settings → General → Reference ID

### 8.3 Save the File

1. **Save** the `.env` file
2. **Make sure** it's in the project root (same folder as `package.json`)
3. **⚠️ IMPORTANT:** Never commit `.env` to Git! It contains secrets.

✅ **Environment variables are now configured!**

---

## 9. STEP 8: INSTALL PROJECT DEPENDENCIES

### 9.1 Open Terminal in Project Folder

1. **Navigate** to your project folder
2. **Open terminal/command prompt** in that folder
   - Windows: Right-click folder → "Open in Terminal"
   - Mac/Linux: Right-click folder → "Open in Terminal"

### 9.2 Install Dependencies

**Run this command:**
```bash
npm install
```

**Wait:** This may take 2-5 minutes. You'll see many packages being downloaded.

**Expected output:**
```
added 1234 packages, and audited 1235 packages in 2m
```

### 9.3 Verify Installation

**Run:**
```bash
npm run build
```

**Expected output:**
```
✓ built in X.XXs
```

✅ **Dependencies are installed!**

---

## 10. STEP 9: RUN THE PROJECT LOCALLY

### 10.1 Start Development Server

**Run:**
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8085/
  ➜  Network: use --host to expose
```

### 10.2 Open in Browser

1. **Open your web browser** (Chrome, Firefox, Safari, etc.)
2. **Go to:** `http://localhost:8085`
3. **You should see** the homepage of your application!

### 10.3 Test Basic Functionality

1. **Navigate** through the pages:
   - Homepage (`/`)
   - Listings (`/listings`)
   - Valuation Form (`/valutiamo`)
2. **Try to register** a new account:
   - Go to `/auth`
   - Click "Sign up"
   - Enter email and password
   - Check your email for verification link

✅ **Project is running locally!**

---

## 11. STEP 10: CREATE ADMIN USER

### 11.1 Register a User Account

1. **In your running app:** Go to `/auth`
2. **Sign up** with your email
3. **Verify** your email (check inbox)
4. **Log in** to your account

### 11.2 Get Your User ID

1. **In Supabase Dashboard:** Go to Authentication → Users
2. **Find your user** (by email)
3. **Click** on your user
4. **Copy the UUID** (looks like: `123e4567-e89b-12d3-a456-426614174000`)

### 11.3 Make User Admin

1. **In Supabase Dashboard:** Go to SQL Editor
2. **Run this SQL** (replace `YOUR_USER_UUID` with your actual UUID):

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

3. **Click:** "Run"
4. **Verify:** You should see "Success. No rows returned" or "INSERT 0 1"

### 11.4 Test Admin Access

1. **In your app:** Log out and log back in
2. **Go to:** `/admin`
3. **You should see** the admin dashboard!

✅ **Admin user is created!**

---

## 12. STEP 11: DEPLOY TO PRODUCTION (VERCEL)

### 12.1 Create Vercel Account

1. **Go to:** https://vercel.com/
2. **Sign up** with GitHub, GitLab, or email
3. **Verify** your email

### 12.2 Install Vercel CLI

```bash
npm install -g vercel
```

### 12.3 Deploy to Vercel

1. **In terminal**, navigate to your project folder
2. **Run:**
   ```bash
   vercel
   ```
3. **Follow prompts:**
   - "Set up and deploy?": Yes
   - "Which scope?": Your account
   - "Link to existing project?": No
   - "Project name?": (press Enter for default)
   - "Directory?": (press Enter for current directory)
   - "Override settings?": No
4. **Wait** for deployment (2-5 minutes)

### 12.4 Set Environment Variables in Vercel

1. **Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add each variable:**
   - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_REF.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `YOUR_ANON_KEY`
   - `VITE_SUPABASE_PROJECT_ID` = `YOUR_PROJECT_REF`
3. **For each variable:**
   - Select "Production", "Preview", and "Development"
   - Click "Save"
4. **Redeploy:** Go to Deployments → Click "..." → "Redeploy"

### 12.5 Update Supabase Auth URLs

1. **In Supabase Dashboard:** Authentication → URL Configuration
2. **Update Site URL** to your Vercel URL: `https://your-project.vercel.app`
3. **Add Redirect URL:** `https://your-project.vercel.app/**`
4. **Update ALLOWED_ORIGINS** in Edge Functions secrets:
   ```
   https://your-project.vercel.app,https://yourdomain.com
   ```

### 12.6 Test Production Deployment

1. **Visit** your Vercel URL
2. **Test** all functionality:
   - Homepage loads
   - User registration works
   - Login works
   - Admin dashboard accessible (if you're admin)

✅ **Project is deployed to production!**

---

## 13. TROUBLESHOOTING

### Problem: "Cannot find module" error

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Missing environment variables" error

**Solution:**
1. Check that `.env` file exists in project root
2. Check that variable names start with `VITE_`
3. Restart dev server after changing `.env`

### Problem: "Failed to fetch" or CORS errors

**Solution:**
1. Check `ALLOWED_ORIGINS` in Supabase Edge Functions secrets
2. Make sure your local URL (`http://localhost:8085`) is included
3. Redeploy edge functions after changing secrets

### Problem: "RLS policy violation" error

**Solution:**
1. Make sure you ran the full migration SQL
2. Check that you're logged in as a user
3. Verify user_roles table has your user

### Problem: Edge functions not deploying

**Solution:**
1. Make sure you're logged in: `supabase login`
2. Make sure project is linked: `supabase link --project-ref YOUR_REF`
3. Check you're in the correct directory (where `supabase` folder is)

### Problem: "Bucket not found" error

**Solution:**
1. Create `message-attachments` bucket in Supabase Storage
2. Make sure it's PRIVATE (not public)
3. Run storage policies SQL from migration

---

## 🎉 CONGRATULATIONS!

You've successfully set up and deployed the project! 

**Next steps:**
- Customize the design and content
- Add your own branding
- Configure email templates
- Set up custom domain in Vercel

**Need help?** Check the troubleshooting section or review the steps above.

---

**Last Updated:** December 29, 2025  
**Version:** 1.0.0
