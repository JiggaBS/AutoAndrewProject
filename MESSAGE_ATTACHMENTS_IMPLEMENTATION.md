# 📎 Message Attachments Implementation

This document describes the implementation of document/file attachments in the messaging system.

## ✅ Features Implemented

### 1. **Storage Bucket Setup**
- Created `message-attachments` storage bucket in Supabase
- Configured with 10MB file size limit per file
- Supports common document types: PDF, Word, Excel, PowerPoint, Images, Text, CSV
- Private bucket with RLS policies for secure access

### 2. **File Upload in Composer**
- Added file attachment button (📎) in the message composer
- Supports multiple file selection (up to 5 files)
- File size validation (10MB max per file)
- File type validation (only allowed MIME types)
- Visual preview of selected files before sending
- Ability to remove files before sending

### 3. **Attachment Display**
- Attachments displayed in message bubbles
- Shows file name, size, and type icon
- Download/open buttons for each attachment
- Special handling for images (preview option)

### 4. **Database Updates**
- Updated `send_valuation_message` function to accept attachments
- Allows empty message body when attachments are present
- Stores attachments as JSONB array with metadata:
  - File ID (storage path)
  - File name
  - File URL (signed URL for private access)
  - File type (MIME type)
  - File size
  - Upload timestamp

### 5. **Security**
- RLS policies ensure users can only access attachments from their own requests
- Admins can access all attachments
- Files stored in request-specific folders: `request/{request_id}/{filename}`
- Signed URLs generated for secure file access (1 year expiry)

## 📁 Files Modified/Created

### New Files:
1. `supabase/migrations/20251228030000_create_message_attachments_storage.sql`
   - Creates storage bucket
   - Sets up RLS policies

2. `supabase/migrations/20251228030100_update_message_function_allow_empty_with_attachments.sql`
   - Updates message function to allow empty body with attachments

### Modified Files:
1. `src/features/messages/types.ts`
   - Added `MessageAttachment` interface
   - Updated `Message` interface to use typed attachments

2. `src/features/messages/components/Composer.tsx`
   - Added file input and attachment preview
   - File validation and error handling
   - UI for managing attachments

3. `src/features/messages/components/MessageBubble.tsx`
   - Added attachment display component
   - File type icons and download buttons

4. `src/features/messages/hooks/useMessages.ts`
   - Added file upload functionality
   - Generates signed URLs for file access
   - Handles attachment metadata

5. `src/features/messages/components/ChatThread.tsx`
   - Passes requestId to Composer
   - Handles file attachments in send flow

## 🚀 Usage

### For Users:
1. Click the paperclip (📎) icon in the message composer
2. Select one or more files (up to 5 files, 10MB each)
3. Files appear as preview cards below the input
4. Remove files by clicking the X button on each card
5. Send message with or without text (attachments alone are allowed)

### For Admins:
- Same functionality as users
- Can access attachments from all requests
- Can upload files to any request

## 📋 Supported File Types

- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Images**: JPEG, PNG, GIF, WEBP
- **Text**: TXT, CSV

## 🔒 Security Features

1. **Private Storage**: Files stored in private bucket, not publicly accessible
2. **RLS Policies**: Row-level security ensures users only access their own request files
3. **Signed URLs**: Temporary signed URLs for file access (1 year expiry)
4. **File Validation**: Server-side validation of file types and sizes
5. **Path-based Access**: Files organized by request ID for easy access control

## 📝 Database Schema

Attachments are stored as JSONB in the `valuation_messages.attachments` column:

```json
[
  {
    "id": "request/{request_id}/{timestamp}-{filename}",
    "name": "document.pdf",
    "url": "https://...signed-url...",
    "type": "application/pdf",
    "size": 123456,
    "uploaded_at": "2025-12-28T12:00:00Z"
  }
]
```

## 🔄 Migration Steps

To apply these changes to your Supabase project:

1. **Run Storage Migration**:
   ```sql
   -- Execute: 20251228030000_create_message_attachments_storage.sql
   ```

2. **Update Message Function**:
   ```sql
   -- Execute: 20251228030100_update_message_function_allow_empty_with_attachments.sql
   ```

3. **Verify Storage Bucket**:
   - Go to Supabase Dashboard → Storage
   - Verify `message-attachments` bucket exists
   - Check RLS policies are active

## 🐛 Troubleshooting

### Files not uploading?
- Check browser console for errors
- Verify storage bucket exists
- Check RLS policies are correctly applied
- Ensure user has permission for the request

### Files not displaying?
- Check that attachments JSON is properly formatted
- Verify signed URLs are being generated
- Check browser network tab for failed requests

### Access denied errors?
- Verify RLS policies match the file path structure
- Ensure user owns the request or is an admin
- Check that request_id in path matches the actual request

## 📊 Future Enhancements

Potential improvements:
- Image preview in message bubbles
- File thumbnails for documents
- Progress indicator for large file uploads
- Drag-and-drop file upload
- File compression before upload
- Virus scanning integration
