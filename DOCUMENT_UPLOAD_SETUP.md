# Document Upload System Setup Guide

## 🚀 Overview

This guide will help you set up the complete document upload system for driver applications in MyPartsRunner. The system allows drivers to upload:

- **Driver's License Photo** (required)
- **Insurance Card** (required) 
- **Vehicle Registration** (required)
- **Background Check Consent Form** (required)

## 📋 Prerequisites

- Supabase project with Storage enabled
- Admin access to your Supabase dashboard
- MyPartsRunner application code updated

## 🔧 Setup Steps

### Step 1: Database Migration

Run the database migration to add document fields:

```sql
-- Run this in your Supabase SQL Editor
-- File: add-document-upload-fields.sql
```

This adds:
- `driver_license_url` - URL to uploaded license photo
- `insurance_card_url` - URL to uploaded insurance card
- `vehicle_registration_url` - URL to uploaded registration
- `background_check_consent_url` - URL to uploaded consent form

### Step 2: Storage Bucket Setup

Create the storage bucket for driver documents:

```sql
-- Run this in your Supabase SQL Editor
-- File: setup-storage-bucket.sql
```

This creates:
- `driver-documents` bucket with 5MB file limit
- Storage policies for authenticated users
- Support for JPG, PNG, WebP, and PDF files

### Step 3: Storage Bucket Creation (Manual)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Set:
   - **Name**: `driver-documents`
   - **Public bucket**: ✅ Checked
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, application/pdf`

### Step 4: Storage Policies (Manual)

1. Go to **Storage** → **Policies**
2. Find the `driver-documents` bucket
3. Click **New Policy**
4. Add these policies:

#### Policy 1: Upload Access
- **Policy name**: `Allow authenticated users to upload driver documents`
- **Allowed operation**: `INSERT`
- **Policy definition**:
```sql
bucket_id = 'driver-documents' AND auth.role() = 'authenticated'
```

#### Policy 2: View Access
- **Policy name**: `Allow authenticated users to view driver documents`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
bucket_id = 'driver-documents' AND auth.role() = 'authenticated'
```

#### Policy 3: Update Access
- **Policy name**: `Allow users to update their own driver documents`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
```sql
bucket_id = 'driver-documents' AND auth.role() = 'authenticated'
```

#### Policy 4: Delete Access
- **Policy name**: `Allow users to delete their own driver documents`
- **Allowed operation**: `DELETE`
- **Policy definition**:
```sql
bucket_id = 'driver-documents' AND auth.role() = 'authenticated'
```

## 🎯 Features

### For Drivers
- **Drag & Drop** file uploads
- **Image preview** for photos
- **File validation** (type, size)
- **Progress indicators** during upload
- **Error handling** with user-friendly messages

### For Admins
- **Document viewer** in admin dashboard
- **Image preview** modal for photos
- **PDF viewer** for documents
- **Download** functionality
- **Document status** tracking

## 📁 File Organization

Documents are automatically organized in folders:
```
driver-documents/
├── drivers-license/
├── vehicle-registration/
├── insurance/
└── background-check/
```

## 🔒 Security Features

- **File type validation** (JPG, PNG, WebP, PDF only)
- **File size limits** (5MB max per file)
- **Authenticated access only**
- **Secure file URLs** via Supabase Storage
- **Automatic file cleanup** when applications are deleted

## 🧪 Testing

### Test Upload Flow
1. Go to `/driver-application`
2. Fill out the form
3. Upload test documents
4. Submit application
5. Check database for document URLs
6. Verify files in Supabase Storage

### Test Admin View
1. Go to `/admin/driver-review`
2. Click on an application
3. Verify documents are visible
4. Test preview/download functionality

## 🚨 Troubleshooting

### Common Issues

**"Storage bucket not found"**
- Ensure `driver-documents` bucket exists
- Check bucket name spelling

**"Upload failed"**
- Verify storage policies are set correctly
- Check file size (must be ≤ 5MB)
- Ensure file type is supported

**"Documents not showing in admin"**
- Check database migration ran successfully
- Verify document URLs are saved in database
- Check storage bucket permissions

**"Preview not working"**
- Ensure images are uploaded as image files
- Check browser console for errors
- Verify file URLs are accessible

### Debug Steps
1. Check browser console for errors
2. Verify Supabase Storage bucket exists
3. Check storage policies are correct
4. Verify database columns exist
5. Test with smaller files first

## 📚 API Reference

### Storage Functions

```typescript
// Upload a document
uploadDocument(file: File, folder: string, fileName?: string): Promise<UploadResult>

// Delete a document
deleteDocument(filePath: string): Promise<boolean>

// Validate file type
isValidFileType(file: File, allowedTypes: string[]): boolean

// Validate file size
isValidFileSize(file: File, maxSizeMB: number): boolean
```

### DocumentUpload Component

```typescript
<DocumentUpload
  label="Document Title"
  description="Document description"
  required={true}
  acceptedTypes={['image/jpeg', 'image/png']}
  maxSizeMB={5}
  value={documentUrl}
  onChange={(url) => setDocumentUrl(url)}
  onRemove={() => setDocumentUrl('')}
  folder="folder-name"
/>
```

## 🎉 Success Checklist

- [ ] Database migration completed
- [ ] Storage bucket created
- [ ] Storage policies configured
- [ ] Document uploads working
- [ ] Admin document viewer working
- [ ] File validation working
- [ ] Error handling tested
- [ ] Security policies verified

## 🔄 Updates & Maintenance

- **File cleanup**: Implement automatic cleanup for rejected applications
- **Backup strategy**: Consider backing up important documents
- **Monitoring**: Monitor storage usage and costs
- **Updates**: Keep Supabase client libraries updated

---

**Need help?** Check the Supabase documentation or contact support. 