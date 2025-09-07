import React, { useState, useRef } from 'react';
import { Upload, X, Eye, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { uploadDocument, UploadResult } from '@/lib/storage';

interface DocumentUploadProps {
  label: string;
  description?: string;
  required?: boolean;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  placeholder?: string;
  className?: string;
  folder?: string;
}

export function DocumentUpload({
  label,
  description,
  required = false,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeMB = 5,
  value,
  onChange,
  onRemove,
  placeholder = "Click to upload or drag and drop",
  className = "",
  folder = "general"
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`File type not supported. Please upload: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    
    // Add timeout to prevent stuck uploading state
    const uploadTimeout = setTimeout(() => {
      setIsUploading(false);
      setError('Upload timeout. Please try again.');
    }, 30000); // 30 second timeout
    
    try {
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      // Upload to Supabase Storage
      const result: UploadResult = await uploadDocument(file, folder);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update the form with the real URL
      onChange(result.url);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to upload file: ${errorMessage}. Please try again.`);
      console.error('Upload error:', err);
      
      // Clear preview if upload failed
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      clearTimeout(uploadTimeout);
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onRemove();
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    if (!value) return <Upload className="h-8 w-8 text-muted-foreground" />;
    
    if (value.includes('.pdf')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    
    return <Eye className="h-8 w-8 text-green-600" />;
  };

  const getFileType = () => {
    if (!value) return '';
    if (value.includes('.pdf')) return 'PDF';
    return 'Image';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor={`upload-${label}`} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {value && (
          <Badge variant="secondary" className="text-xs">
            {getFileType()}
          </Badge>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openFileDialog}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Try Again'}
          </Button>
        </div>
      )}

      {!value && !error ? (
        <Card 
          className={`border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer ${
            isUploading ? 'opacity-50' : ''
          }`}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{placeholder}</p>
                <p className="text-xs text-muted-foreground">
                  {acceptedTypes.includes('application/pdf') ? 'PDF, JPG, PNG up to' : 'JPG, PNG up to'} {maxSizeMB}MB
                </p>
              </div>
              {isUploading && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon()}
                <div>
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-muted-foreground">{getFileType()} file</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {previewUrl && previewUrl.startsWith('blob:') && (
              <div className="mt-3">
                <img 
                  src={previewUrl} 
                  alt="Document preview" 
                  className="max-w-full h-32 object-contain rounded border"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
        id={`upload-${label}`}
      />
    </div>
  );
} 