import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface MediaUploadProps {
  onMediaUpload: (mediaData: { 
    images: string[];
    video_url: string | null;
    thumbnail_url: string | null;
  }) => void;
  maxFiles?: number;
  initialMedia?: {
    images: string[] | null;
    video_url: string | null;
    thumbnail_url: string | null;
  };
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onMediaUpload, 
  maxFiles = 5,
  initialMedia = { images: null, video_url: null, thumbnail_url: null } 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    url: string;
    type: 'image' | 'video';
    name: string;
  }[]>(
    [
      ...(initialMedia.video_url ? [{
        url: initialMedia.video_url,
        type: 'video' as const,
        name: 'Existing Video'
      }] : []),
      ...(initialMedia.images || []).map(url => ({
        url,
        type: 'image' as const,
        name: 'Existing Image'
      }))
    ]
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const videoFileInput = Array.from(files).find(file => file.type.startsWith('video/'));
    const imageFilesInput = Array.from(files).filter(file => file.type.startsWith('image/'));

    // Check if trying to upload more than one video
    if (videoFileInput && uploadedFiles.some(f => f.type === 'video')) {
      toast({ 
        title: 'Error', 
        description: 'Only one video file is allowed per listing', 
        variant: 'destructive' 
      });
      return;
    }

    // Check total file count
    const totalImages = uploadedFiles.filter(f => f.type === 'image').length + imageFilesInput.length;
    const hasVideo = videoFileInput || uploadedFiles.some(f => f.type === 'video');
    if (totalImages > maxFiles - (hasVideo ? 1 : 0)) {
      toast({ 
        title: 'Error', 
        description: `Maximum ${maxFiles} files allowed (including video)`, 
        variant: 'destructive' 
      });
      return;
    }

    setUploading(true);
    const newFiles: typeof uploadedFiles = [];

    try {
      // Upload video first if exists
      if (videoFileInput) {
        const fileExt = videoFileInput.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-videos')
          .upload(fileName, videoFileInput);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-videos')
          .getPublicUrl(fileName);

        newFiles.push({
          url: publicUrl,
          type: 'video',
          name: videoFileInput.name
        });
      }

      // Upload images
      for (const file of imageFilesInput) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        newFiles.push({
          url: publicUrl,
          type: 'image',
          name: file.name
        });
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      
      // Separate video_url and images
      const videoFile = updatedFiles.find(f => f.type === 'video');
      const imageFiles = updatedFiles.filter(f => f.type === 'image');
      
      onMediaUpload({
        images: imageFiles.map(f => f.url),
        video_url: videoFile ? videoFile.url : null,
        thumbnail_url: imageFiles.length > 0 ? imageFiles[0].url : null
      });

      toast({ title: 'Success', description: 'Files uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    
    // Update parent component with new file structure
    const videoUrl = updatedFiles.find(f => f.type === 'video')?.url || null;
    const images = updatedFiles
      .filter(f => f.type === 'image')
      .map(f => f.url);
    
    onMediaUpload({
      images,
      video_url: videoUrl,
      thumbnail_url: images[0] || null
    });
  };

  // Helper function to get display URL - no longer needed since we store full URLs
  const getDisplayUrl = (file: { url: string; type: 'image' | 'video' }) => {
    return file.url;
  };

  return (
    <div className="space-y-4">
      <Label>Photos & Videos</Label>
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Upload photos and videos of your item
              </p>
              <p className="text-xs text-gray-500">
                Supports JPG, PNG, MP4, MOV (max {maxFiles} files, 1 video)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="media-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={uploading}
              onClick={() => document.getElementById('media-upload')?.click()}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Uploaded Files</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaUpload;