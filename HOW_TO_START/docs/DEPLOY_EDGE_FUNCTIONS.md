# 🚀 Complete Guide: Deploying Supabase Edge Functions

## Overview

Your app uses **5 Edge Functions**. Here's what each one does and how to deploy them:

## 📋 Edge Functions List

### 1. ✅ `fetch-vehicles` (REQUIRED)
**Purpose**: Fetches vehicle data from Multigestionale API  
**Used by**: Home page, Listings page, Vehicle detail pages  
**Status**: **MUST DEPLOY** - App won't show vehicles without this

### 2. ✅ `submit-valuation` (REQUIRED)
**Purpose**: Handles car valuation form submissions  
**Used by**: `/valutiamo` page  
**Status**: **MUST DEPLOY** - Valuation form won't work without this

### 3. ✅ `public-config` (REQUIRED)
**Purpose**: Returns public configuration (Supabase URL, keys)  
**Used by**: Google Analytics, public components  
**Status**: **MUST DEPLOY** - Some features may break without this

### 4. ⚠️ `notify-client` (OPTIONAL)
**Purpose**: Sends email notifications to clients  
**Used by**: Admin panel (when sending messages to clients)  
**Status**: **OPTIONAL** - Only needed if you want email notifications

### 5. ⚠️ `notify-admin` (OPTIONAL)
**Purpose**: Sends email notifications to admin  
**Used by**: System notifications  
**Status**: **OPTIONAL** - Only needed if you want email notifications

---

## 🚀 Deployment Methods

### Method 1: Using Supabase CLI (Recommended)

#### Step 1: Install and Login
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login
```

#### Step 2: Link Your Project
```bash
# Link to your Supabase project
supabase link --project-ref yrezizlmudrzccknthtl
```

**Note**: Replace `yrezizlmudrzccknthtl` with your actual project ID if different.

#### Step 3: Deploy All Functions

**Deploy Required Functions:**
```bash
# 1. Deploy fetch-vehicles (for vehicle listings)
supabase functions deploy fetch-vehicles

# 2. Deploy submit-valuation (for valuation form)
supabase functions deploy submit-valuation

# 3. Deploy public-config (for public configuration)
supabase functions deploy public-config
```

**Deploy Optional Functions (if you need email notifications):**
```bash
# 4. Deploy notify-client (for client email notifications)
supabase functions deploy notify-client

# 5. Deploy notify-admin (for admin email notifications)
supabase functions deploy notify-admin
```

**Or deploy all at once:**
```bash
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy public-config
supabase functions deploy notify-client
supabase functions deploy notify-admin
```

---

### Method 2: Using Supabase Dashboard (Easier, No CLI Required)

#### Step 1: Go to Edge Functions
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Edge Functions** in the left sidebar

#### Step 2: Deploy Each Function

For each function below, follow these steps:

1. Click **"Create a new function"** or **"New Function"**
2. Enter the function name (e.g., `fetch-vehicles`)
3. Copy the code from the corresponding file:
   - `supabase/functions/fetch-vehicles/index.ts`
   - `supabase/functions/submit-valuation/index.ts`
   - `supabase/functions/public-config/index.ts`
   - `supabase/functions/notify-client/index.ts`
   - `supabase/functions/notify-admin/index.ts`
4. Paste the code into the editor
5. Click **"Deploy"** or **"Save"**

#### Required Functions to Deploy:

**1. `fetch-vehicles`**
- File: `supabase/functions/fetch-vehicles/index.ts`
- **Settings**: JWT verification = OFF (already configured in `config.toml`)

**2. `submit-valuation`**
- File: `supabase/functions/submit-valuation/index.ts`
- **Settings**: JWT verification = OFF

**3. `public-config`**
- File: `supabase/functions/public-config/index.ts`
- **Settings**: JWT verification = OFF

**4. `notify-client`** (Optional)
- File: `supabase/functions/notify-client/index.ts`
- **Settings**: JWT verification = OFF

**5. `notify-admin`** (Optional)
- File: `supabase/functions/notify-admin/index.ts`
- **Settings**: JWT verification = OFF (or ON if you want admin-only access)

---

## 🔑 Configure Secrets (After Deployment)

After deploying the functions, you need to add secrets:

1. Go to **Settings** → **Edge Functions** → **Secrets**
2. Add these secrets:

### Required Secrets:

**`MULTIGESTIONALE_API_KEY`**
- **Value**: Your Multigestionale API key
- **Used by**: `fetch-vehicles` function
- **Required for**: Vehicle listings to work

### Optional Secrets (for email notifications):

**`RESEND_API_KEY`**
- **Value**: Your Resend API key (if using Resend for emails)
- **Used by**: `notify-client`, `notify-admin`, `submit-valuation`
- **Required for**: Email notifications to work

**`SUPABASE_URL`**
- **Value**: Your Supabase project URL (e.g., `https://yrezizlmudrzccknthtl.supabase.co`)
- **Used by**: Functions that need to access Supabase database

**`SUPABASE_SERVICE_ROLE_KEY`**
- **Value**: Your Supabase service role key (from Settings → API)
- **Used by**: Functions that need admin database access
- ⚠️ **KEEP THIS SECRET** - Never expose in frontend code

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] **fetch-vehicles** deployed
  - Test: Go to `/listings` page - vehicles should load
  - Check: Browser console should show successful API calls

- [ ] **submit-valuation** deployed
  - Test: Go to `/valutiamo` page - submit a form
  - Check: Form should submit successfully

- [ ] **public-config** deployed
  - Test: Check browser console - no errors about missing config
  - Check: Google Analytics should work (if configured)

- [ ] **MULTIGESTIONALE_API_KEY** secret added
  - Test: Vehicles should load from Multigestionale API
  - Check: No "API key not configured" errors

- [ ] **Optional functions** (if needed):
  - [ ] notify-client deployed (if using email notifications)
  - [ ] notify-admin deployed (if using email notifications)
  - [ ] RESEND_API_KEY secret added (if using email notifications)

---

## 🔍 Troubleshooting

### Function Not Found (404)
- **Problem**: Function not deployed
- **Solution**: Deploy the function using one of the methods above

### "API key not configured" Error
- **Problem**: `MULTIGESTIONALE_API_KEY` secret not added
- **Solution**: Add the secret in Supabase Dashboard → Settings → Edge Functions → Secrets

### "Failed to send request" Error
- **Problem**: Function exists but can't be reached
- **Solution**: 
  1. Check function is deployed and active
  2. Verify Supabase URL in `.env` file is correct
  3. Restart dev server after updating `.env`

### Function Deployed But Not Working
- **Problem**: Secrets not configured or function code issue
- **Solution**: 
  1. Check Edge Function logs in Supabase Dashboard
  2. Verify all required secrets are added
  3. Check browser console for specific error messages

---

## 📝 Quick Reference Commands

```bash
# Deploy all required functions
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy public-config

# Deploy optional functions (if needed)
supabase functions deploy notify-client
supabase functions deploy notify-admin

# Check deployment status
supabase functions list

# View function logs
supabase functions logs fetch-vehicles
```

---

## 🎯 Minimum Deployment (Quick Start)

If you just want to get the app working quickly, deploy these 3 functions:

```bash
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy public-config
```

Then add the `MULTIGESTIONALE_API_KEY` secret, and your app should work!

---

## 📚 Additional Resources

- **Supabase Edge Functions Docs**: https://supabase.com/docs/guides/functions
- **Function Code Location**: `supabase/functions/[function-name]/index.ts`
- **Configuration**: `supabase/config.toml`
