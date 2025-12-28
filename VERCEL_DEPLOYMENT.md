# 🚀 Vercel Deployment Guide

## Environment Variables Setup

Yes, you need to add **all your `.env` variables** to Vercel, but only the ones that start with `VITE_` (these are the ones that get bundled into your frontend).

### ✅ Required Environment Variables (Add to Vercel)

Add these in your Vercel project settings:

1. **VITE_SUPABASE_URL** (Required)
   - Your Supabase project URL
   - Example: `https://yrezizlmudrzccknthtl.supabase.co`

2. **VITE_SUPABASE_PUBLISHABLE_KEY** (Required)
   - Your Supabase publishable/anon key
   - This is safe to expose in frontend code
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **VITE_SUPABASE_PROJECT_ID** (Recommended)
   - Your Supabase project ID
   - Example: `yrezizlmudrzccknthtl`

### 🔧 Optional Environment Variables

These are optional but recommended for full functionality:

4. **VITE_SITE_URL** (Optional)
   - Your production site URL
   - Used for SEO, sitemap generation, and schema.org markup
   - Example: `https://autoandrew.it` or `https://your-domain.vercel.app`
   - Defaults to `https://autoandrew.it` if not set

5. **VITE_GA_MEASUREMENT_ID** (Optional)
   - Google Analytics Measurement ID
   - Format: `G-XXXXXXXXXX`
   - Only add if you're using Google Analytics

6. **VITE_SENTRY_DSN** (Optional)
   - Sentry DSN for error tracking
   - Format: `https://your-sentry-dsn@sentry.io/project-id`
   - Only add if you're using Sentry

7. **VITE_SENTRY_ENABLE_IN_DEV** (Optional)
   - Set to `true` to enable Sentry in development
   - Usually leave this unset or set to `false`

8. **VITE_APP_VERSION** (Optional)
   - Your app version for tracking
   - Example: `1.0.0`

### ❌ DO NOT Add to Vercel (Backend Secrets)

These should **NOT** be in Vercel environment variables. They belong in **Supabase Edge Functions Secrets**:

- `MULTIGESTIONALE_API_KEY` → Add in Supabase Dashboard → Settings → Edge Functions → Secrets
- `RESEND_API_KEY` → Add in Supabase Dashboard → Settings → Edge Functions → Secrets
- `SUPABASE_SERVICE_ROLE_KEY` → Auto-configured in Supabase (never expose this!)

---

## 📋 Step-by-Step: Adding Environment Variables to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project:**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Settings:**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add each variable:**
   - Click **Add New**
   - Enter the **Name** (e.g., `VITE_SUPABASE_URL`)
   - Enter the **Value** (your actual value)
   - Select environments:
     - ✅ **Production** (required)
     - ✅ **Preview** (recommended)
     - ✅ **Development** (optional, for local testing)
   - Click **Save**

4. **Repeat for all required variables:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SITE_URL` (optional)
   - `VITE_GA_MEASUREMENT_ID` (optional)
   - `VITE_SENTRY_DSN` (optional)

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
vercel env add VITE_SUPABASE_PROJECT_ID production
vercel env add VITE_SITE_URL production
# ... add others as needed
```

---

## 🔍 Quick Reference: Your Current Values

Based on your `SUPABASE_SETUP_COMPLETE.md`, here are your values:

```env
VITE_SUPABASE_URL="https://yrezizlmudrzccknthtl.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZXppemxtdWRyemNja250aHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODExMzksImV4cCI6MjA4MjQ1NzEzOX0.DjABFHvHPbY38Z33RWYfag9DVc_W_Q-yPvo_Q5580iI"
VITE_SUPABASE_PROJECT_ID="yrezizlmudrzccknthtl"
VITE_SITE_URL="https://autoandrew.it"  # Update with your actual domain
```

---

## ⚠️ Important Notes

1. **After adding variables, redeploy:**
   - Environment variables are only available after a new deployment
   - Go to **Deployments** tab → Click **Redeploy** on the latest deployment
   - Or push a new commit to trigger a new deployment

2. **VITE_ prefix is required:**
   - Only variables starting with `VITE_` are exposed to your frontend code
   - Variables without `VITE_` prefix won't be accessible in the browser

3. **Security:**
   - `VITE_SUPABASE_PUBLISHABLE_KEY` is safe to expose (it's designed for frontend use)
   - Never add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (it's a backend secret)

4. **Sitemap API:**
   - The `/api/sitemap.xml.ts` route also needs these variables
   - Vercel automatically makes `VITE_*` variables available as `process.env.VITE_*` in API routes

5. **Different values per environment:**
   - You can set different values for Production, Preview, and Development
   - Useful if you have separate Supabase projects for staging/production

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All required environment variables are set in Vercel
- [ ] Deployment completed successfully
- [ ] App loads without console errors
- [ ] Supabase connection works (check browser console)
- [ ] Authentication works (try logging in)
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Google Analytics works (if configured)
- [ ] Sentry error tracking works (if configured)

---

## 🆘 Troubleshooting

### "Missing required environment variable" error

- Check that all `VITE_*` variables are set in Vercel
- Make sure you redeployed after adding variables
- Verify variable names match exactly (case-sensitive)

### Sitemap not working

- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
- Check that your Supabase Edge Function `fetch-vehicles` is deployed
- Verify the sitemap route at `/sitemap.xml`

### Supabase connection fails

- Double-check `VITE_SUPABASE_URL` is correct (no trailing slash)
- Verify `VITE_SUPABASE_PUBLISHABLE_KEY` is the anon/publishable key (not service role)
- Check browser console for specific error messages

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- Your project's `SUPABASE_SETUP_COMPLETE.md` for Supabase configuration
