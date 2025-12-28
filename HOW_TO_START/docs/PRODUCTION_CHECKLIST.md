# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## Pre-Deployment (Critical)

### 1. Environment Variables ✅
- [ ] **Vercel Project Environment Variables:**
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_GA_MEASUREMENT_ID` (optional)
  - [ ] `VITE_SENTRY_DSN` (optional)

- [ ] **Supabase Edge Functions Environment Variables:**
  - [ ] `ALLOWED_ORIGINS` = `https://yourdomain.com,https://www.yourdomain.com`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (SECRET - never expose to frontend!)
  - [ ] `MULTIGESTIONALE_API_KEY`
  - [ ] `RESEND_API_KEY` (if using email)
  - [ ] `DEALER_EMAIL`
  - [ ] `ADMIN_EMAIL`

### 2. Supabase Configuration ✅
- [ ] **Auth Settings:**
  - [ ] Site URL set to production domain
  - [ ] Redirect URLs include: `https://yourdomain.com/**`, `https://*.vercel.app/**`
  - [ ] Email templates configured
  - [ ] Google OAuth configured (if used)

- [ ] **Database:**
  - [ ] All migrations applied (check `supabase/migrations_export/`)
  - [ ] At least one admin user created (via SQL: `INSERT INTO user_roles (user_id, role) VALUES ('uuid', 'admin')`)
  - [ ] RLS enabled on all tables
  - [ ] Realtime publication configured

- [ ] **Storage:**
  - [ ] `message-attachments` bucket created
  - [ ] Bucket is PRIVATE
  - [ ] File size limit: 10MB
  - [ ] MIME types configured
  - [ ] Storage policies applied

- [ ] **Edge Functions:**
  - [ ] All functions deployed: `fetch-vehicles`, `submit-valuation`, `notify-admin`, `notify-client`, `public-config`
  - [ ] Verify JWT enabled on protected functions
  - [ ] Test each function in production

### 3. Code Fixes (High Priority) ⚠️
- [ ] **Fix React Hook Dependencies** (7 files - see `HOOK_DEPS_FIX.md`)
  - [ ] `src/components/ImageGallery.tsx`
  - [ ] `src/components/VehicleCard.tsx`
  - [ ] `src/pages/Admin.tsx`
  - [ ] `src/pages/Dashboard.tsx`
  - [ ] `src/pages/VehicleDetail.tsx`
  - [ ] `src/hooks/useRealtimeNotifications.ts`

- [ ] **Add CSP Header** to `vercel.json`
  ```json
  {
    "key": "Content-Security-Policy",
    "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'"
  }
  ```

- [ ] **Reduce Signed URL Expiry** in `src/features/messages/hooks/useMessages.ts:88`
  ```typescript
  .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours instead of 1 year
  ```

- [ ] **Remove Debug Info** from `supabase/functions/submit-valuation/index.ts:298-299`
  ```typescript
  // Remove these lines:
  savedPrice: insertedData.price,
  debug: { priceReceived: rawData.price, priceSaved: insertedData.price }
  ```

- [ ] **Verify ALLOWED_ORIGINS** is always set in production edge functions

### 4. TypeScript Cleanup (Optional but Recommended) 📝
- [ ] Replace `any` types with proper types (46 occurrences)
- [ ] Fix empty interface declarations (2 occurrences)
- [ ] Wrap case block declarations in braces (4 occurrences)

### 5. Build & Test ✅
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build

# Expected output:
# ✓ built in X.XXs
# dist/ directory created with all assets

# Test build locally
npm run preview
# Visit http://localhost:4173
```

- [ ] Build completes without errors
- [ ] No console errors on homepage
- [ ] Auth flow works (login/signup/logout)
- [ ] Vehicle listings load
- [ ] Valuation form submits
- [ ] Admin dashboard accessible
- [ ] Messaging works
- [ ] File uploads work

### 6. Vercel Deployment ✅
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# After testing, deploy to production
vercel --prod
```

- [ ] Preview deployment successful
- [ ] Test all flows on preview URL
- [ ] Production deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active

### 7. Post-Deployment Verification ✅

#### Functional Testing:
- [ ] Homepage loads (/)
- [ ] Vehicle listings load (/listings)
- [ ] Vehicle detail page works (/listings/[id])
- [ ] Valuation form submits (/valutiamo)
- [ ] User registration works (/auth)
- [ ] User login works
- [ ] Google OAuth works (if enabled)
- [ ] User dashboard loads (/dashboard)
- [ ] Admin dashboard loads (/admin) - admin only
- [ ] Messaging system works
- [ ] File uploads work in messages
- [ ] File downloads work (signed URLs)
- [ ] Notification bell updates
- [ ] Realtime updates work

#### Security Testing:
- [ ] Check headers in browser DevTools (F12 → Network → select document → Headers)
  - [ ] `strict-transport-security` present
  - [ ] `x-frame-options: DENY` present
  - [ ] `x-content-type-options: nosniff` present
  - [ ] `content-security-policy` present (if added)
- [ ] Verify non-admin cannot access `/admin`
- [ ] Verify users cannot see other users' requests
- [ ] Verify users cannot upload to other users' folders
- [ ] Test SQL injection in forms (should be blocked)
- [ ] Test XSS in message input (should be escaped)

#### Performance Testing:
- [ ] Lighthouse score > 80 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Time to Interactive < 4s

#### Database Testing:
- [ ] Run query on Supabase Dashboard to verify RLS:
  ```sql
  -- As non-admin user, should return 0
  SELECT count(*) FROM valuation_requests WHERE user_id != auth.uid();
  
  -- Should fail (RLS blocks direct inserts)
  INSERT INTO valuation_messages (request_id, sender_type, body) 
  VALUES ('some-uuid', 'user', 'test');
  ```

#### Error Handling:
- [ ] Test 404 page (visit /nonexistent-page)
- [ ] Test offline mode (disable network in DevTools)
- [ ] Test slow network (throttle to 3G in DevTools)
- [ ] Test with browser console errors enabled

### 8. Monitoring Setup (Optional) 📊
- [ ] **Sentry:** Error tracking configured
- [ ] **Google Analytics:** Pageviews tracking
- [ ] **Supabase Logs:** Monitor edge function logs
- [ ] **Vercel Analytics:** Enable in Vercel dashboard
- [ ] Set up alerts for:
  - [ ] High error rates
  - [ ] Failed edge function calls
  - [ ] Database connection errors

### 9. Documentation 📚
- [ ] Update README.md with:
  - [ ] Production URL
  - [ ] Environment variables needed
  - [ ] Deployment instructions
  - [ ] Admin user setup instructions
- [ ] Document API endpoints (edge functions)
- [ ] Create user guide for admin dashboard
- [ ] Document troubleshooting steps

### 10. Backup & Recovery 💾
- [ ] **Database Backups:**
  - [ ] Enable Supabase automatic backups (Project Settings → Database → Backups)
  - [ ] Download initial backup
- [ ] **Code Backups:**
  - [ ] Ensure Git repository is up to date
  - [ ] Tag production release: `git tag v1.0.0-production`
- [ ] **Environment Variables Backup:**
  - [ ] Store in password manager or secure vault
  - [ ] Document where each variable is used

---

## Quick Deployment Commands

### First-Time Deployment:
```bash
# 1. Install dependencies
npm install

# 2. Build
npm run build

# 3. Deploy to Vercel
npx vercel --prod

# 4. Deploy Supabase migrations
supabase db push

# 5. Deploy edge functions
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy notify-admin
supabase functions deploy notify-client
supabase functions deploy public-config

# 6. Create first admin user (via Supabase SQL Editor)
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR-USER-UUID-HERE', 'admin');
```

### Subsequent Deployments:
```bash
# Update code
git pull

# Build & deploy
npm run build
npx vercel --prod

# If database changed, push migrations
supabase db push

# If edge functions changed, redeploy
supabase functions deploy [function-name]
```

---

## Rollback Procedure

### If Deployment Fails:
```bash
# Vercel: Revert to previous deployment
vercel rollback

# Supabase: Rollback last migration
supabase migration repair --status reverted [MIGRATION_VERSION]
```

### Emergency Contacts:
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Developer:** [Your contact info]

---

## Expected Outcomes

### After Successful Deployment:
✅ Application accessible at production URL  
✅ All pages load without errors  
✅ Users can register, login, and submit valuations  
✅ Admin can manage requests and communicate with users  
✅ Realtime messaging works  
✅ File uploads/downloads work  
✅ Email notifications sent (if configured)  
✅ No console errors in browser  
✅ Lighthouse score > 80 on all metrics  
✅ Security headers present  
✅ HTTPS enabled with valid SSL  

### Performance Benchmarks:
- **Homepage Load Time:** < 2 seconds
- **Listings Page:** < 3 seconds (depends on API response)
- **Vehicle Detail:** < 2 seconds
- **Admin Dashboard:** < 3 seconds (authenticated users)
- **Message Send:** < 1 second (excluding file upload)
- **File Upload:** < 5 seconds per 10MB file

---

## GO/NO-GO Criteria

### ✅ GO if:
- All critical environment variables set
- Build succeeds without errors
- At least 1 admin user created
- All RLS policies applied
- Auth redirect URLs configured
- ALLOWED_ORIGINS set for edge functions
- Preview deployment tested successfully

### 🛑 NO-GO if:
- Build fails
- RLS policies not applied (security risk)
- Service role key exposed to frontend
- ALLOWED_ORIGINS not set (CORS issues)
- No admin user (cannot access admin dashboard)
- Auth redirect URLs not configured (login fails)

---

## Post-Launch Monitoring (First 48 Hours)

### Metrics to Watch:
- [ ] **Error Rate:** Should be < 1%
- [ ] **API Response Time:** Average < 500ms
- [ ] **Database Connections:** Monitor for leaks
- [ ] **Edge Function Cold Starts:** First call may be slow
- [ ] **Storage Usage:** Monitor file uploads

### Common Issues & Solutions:

**Issue:** CORS errors on fetch-vehicles  
**Solution:** Verify ALLOWED_ORIGINS includes production domain

**Issue:** "Bucket not found" on file upload  
**Solution:** Verify message-attachments bucket created in Supabase Storage

**Issue:** Users cannot access admin panel  
**Solution:** Verify user has 'admin' role in user_roles table

**Issue:** Realtime not working  
**Solution:** Check Supabase realtime publication is enabled

**Issue:** Email notifications not sent  
**Solution:** Verify RESEND_API_KEY is set correctly

---

**Last Updated:** December 28, 2025  
**Version:** 1.0.0  
**Status:** Ready for Production Deployment
