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
    const uniqueFileName = fileName || ${Date.now()}_;
    const filePath = ${folder}/;

    const { data, error } = await supabase.storage
      .from('driver-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('driver-documents')
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

export async function deleteDocument(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('driver-documents')
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
