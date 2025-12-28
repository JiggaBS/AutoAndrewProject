# 🔧 Fix Attachment Upload Error

## Most Common Issue: Storage Bucket Not Created

The error "Impossibile inviare il messaggio" usually occurs because the storage bucket hasn't been created yet.

## ✅ Solution: Apply Database Migrations

### Step 1: Apply Storage Bucket Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of:
   ```
   supabase/migrations/20251228030000_create_message_attachments_storage.sql
   ```
4. Click **Run** to execute the SQL

### Step 2: Update Message Function

1. Still in **SQL Editor**
2. Copy and paste the contents of:
   ```
   supabase/migrations/20251228030100_update_message_function_allow_empty_with_attachments.sql
   ```
3. Click **Run** to execute the SQL

### Step 3: Verify Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Verify that `message-attachments` bucket exists
3. Check that it's marked as **Private** (not public)

## 🔍 Other Possible Issues

### Issue 2: RLS Policies Not Applied
- **Symptom**: "new row violates row-level security policy"
- **Solution**: Re-run the storage migration SQL

### Issue 3: User Not Authenticated
- **Symptom**: "UNAUTHENTICATED" error
- **Solution**: Make sure you're logged in

### Issue 4: Request ID Mismatch
- **Symptom**: "ACCESS_DENIED" error
- **Solution**: Verify you own the request or are an admin

## 🧪 Test After Fix

1. Try uploading a small file (e.g., a PDF under 1MB)
2. Check browser console (F12) for any errors
3. Verify the file appears in the message

## 📝 Quick SQL Check

Run this in SQL Editor to check if bucket exists:

```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'message-attachments';
```

If it returns no rows, the bucket doesn't exist - apply the migration!
