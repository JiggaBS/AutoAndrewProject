# Complete Database Setup

This file provides a **single SQL migration** that sets up the entire AutoAndrew database from scratch.

## 📄 File: `COMPLETE_DATABASE_SETUP.sql`

**Use this file when:**
- Setting up a fresh Supabase project
- Sharing the codebase with a new developer
- Creating a staging/test environment
- Resetting your database to a clean state

## 🚀 How to Use

### Method 1: Supabase Dashboard (Recommended)

1. **Open your Supabase project**
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste**
   - Open `COMPLETE_DATABASE_SETUP.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the migration**
   - Click "Run" (or press Ctrl+Enter / Cmd+Enter)
   - Wait for completion (should take 5-10 seconds)

5. **Verify success**
   - Check the output messages at the bottom
   - Should see "DATABASE SETUP COMPLETE!"

### Method 2: Supabase CLI

```bash
# Navigate to project root
cd /path/to/AutoAndrewProject

# Reset database (WARNING: destroys all data!)
supabase db reset

# Or apply just this migration
supabase db execute --file COMPLETE_DATABASE_SETUP.sql
```

## ✅ What This Migration Creates

### Tables (7)
- `user_profiles` - Extended user information
- `user_roles` - User role assignments (admin/user)
- `app_settings` - Application configuration
- `saved_vehicles` - User saved vehicle listings
- `valuation_requests` - Car valuation submissions
- `valuation_messages` - Chat messages for requests
- `activity_log` - Admin activity tracking

### Functions (9)
- `get_user_role()` - Get user's role
- `has_role()` - Check if user has specific role
- `get_user_email()` - Get current user's email
- `user_owns_valuation_request()` - Check request ownership
- `valuation_request_is_pending()` - Check request status
- `send_valuation_message()` - Send message via RPC
- `mark_thread_read()` - Mark messages as read
- `insert_system_message()` - Admin system messages
- `handle_new_user()` - Auto-create profile on signup

### Security Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ 26 RLS policies (optimized for performance)
- ✅ SECURITY DEFINER functions with fixed search_path
- ✅ No direct inserts on messages (RPC only)
- ✅ Proper role-based access control

### Realtime
- ✅ `valuation_messages` - Real-time chat updates
- ✅ `valuation_requests` - Real-time status changes
- ✅ `app_settings` - Real-time config updates

### Storage
- ✅ `chat-attachments` bucket for message files
- ✅ Authenticated upload/download policies

## 📋 After Running the Migration

### 1. Create an Admin User

```sql
-- Run in SQL Editor
UPDATE user_roles 
SET role = 'admin'
WHERE user_id = 'YOUR_USER_ID';
```

Or use the helper script:
```bash
# Edit the user_id in the file first
supabase db execute --file HOW_TO_START/scripts/create-admin-user.sql
```

### 2. Configure Environment Variables

Update your `.env` file:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Deploy Edge Functions (Optional)

```bash
cd supabase/functions
supabase functions deploy fetch-vehicles
supabase functions deploy notify-admin
supabase functions deploy notify-client
```

### 4. Test Authentication

- Sign up a test user
- Check that `user_profiles` and `user_roles` are created automatically
- Test login/logout flow

## 🔧 Performance Optimizations Included

This migration includes several performance improvements over older versions:

### 1. Consolidated RLS Policies
**Before**: 2 separate INSERT policies on `valuation_requests`
**After**: 1 combined policy
**Benefit**: ~50% faster inserts

### 2. Removed Unused Indexes
**Before**: 3 indexes on `valuation_messages` (never used)
**After**: Only primary key index
**Benefit**: Faster inserts, less disk space

### 3. Optimized auth.uid() Calls
**Before**: `auth.uid()` called directly in policies
**After**: `(SELECT auth.uid())` wrapped in subquery
**Benefit**: Better query planning, no initialization warnings

## ⚠️ Important Notes

### Idempotency
This migration is **semi-idempotent**:
- ✅ Safe to run multiple times (uses `IF NOT EXISTS`, `DO $$ BEGIN... EXCEPTION...`)
- ✅ Will drop and recreate RLS policies
- ⚠️ Will NOT modify existing data
- ❌ Will fail if you have modified table schemas

### Data Safety
- **Fresh database**: 100% safe to run
- **Existing database with data**: 
  - Tables will NOT be recreated (uses `IF NOT EXISTS`)
  - RLS policies WILL be replaced
  - Functions WILL be replaced
  - **Recommendation**: Test on staging first!

### Foreign Key to auth.users
The migration includes:
```sql
ALTER TABLE public.user_roles 
  ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

This requires access to the `auth` schema. If you get a permission error:
- Run this part separately using the Supabase Dashboard
- Or skip it (the app will still work)

### Trigger on auth.users
The migration creates a trigger on `auth.users`:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

If this fails due to permissions, run it separately in the Dashboard.

## 🐛 Troubleshooting

### "relation already exists"
**Cause**: Tables already exist
**Solution**: This is normal! The migration uses `IF NOT EXISTS`

### "permission denied for schema auth"
**Cause**: Running as non-superuser
**Solution**: Run the foreign key and trigger commands separately in Dashboard

### "duplicate object"
**Cause**: Policies or publications already exist
**Solution**: This is expected! The migration handles this gracefully

### "auth.uid() called without authentication context"
**Cause**: Testing policies outside of authenticated session
**Solution**: This is normal during migration. Policies work correctly in app.

## 📊 Version History

| Date | Version | Changes |
|------|---------|---------|
| Jan 2025 | 2.0 | Consolidated policies, removed unused indexes |
| Dec 2024 | 1.5 | Added message attachments, storage bucket |
| Dec 2024 | 1.0 | Initial complete migration |

## 🤝 Support

If you encounter issues:

1. Check the Supabase Dashboard > Logs
2. Review RLS policy violations
3. Verify Edge Function secrets are set
4. Check browser console for client errors

For more details, see:
- `HOW_TO_START/PROJECT_REFERENCE.md` - Complete project reference guide
- `README.md` - Quick start and overview
