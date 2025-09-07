import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadDocument(
  file: File,
  folder: string,
  fileName?: string
): Promise<UploadResult> {
  try {
    // Test Supabase connection first
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Storage buckets error:', bucketsError);
      return { url: '', path: '', error: `Storage error: ${bucketsError.message}` };
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name));
    
    const uniqueFileName = fileName || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from(folder)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true  // Allow overwriting if file exists
      });

    if (error) {
      console.error('Upload error:', error);
      console.error('File path:', filePath);
      console.error('File size:', file.size);
      console.error('File type:', file.type);
      console.error('Bucket:', folder);
      return { url: '', path: '', error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(folder)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath
    };

  } catch (error) {
    console.error('Storage error:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function deleteDocument(filePath: string, bucket: string = 'drivers-license'): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}
