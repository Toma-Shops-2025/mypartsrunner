import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  RotateCcw, 
  Download, 
  X, 
  Check,
  Image,
  Trash2,
  FlashOn,
  FlashOff,
  SwitchCamera
} from 'lucide-react';

interface DeliveryCameraProps {
  deliveryId: string;
  onPhotoCaptured: (photos: string[]) => void;
  onClose: () => void;
  maxPhotos?: number;
  required?: boolean;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  size: number;
}

const DeliveryCamera: React.FC<DeliveryCameraProps> = ({
  deliveryId,
  onPhotoCaptured,
  onClose,
  maxPhotos = 5,
  required = false
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera constraints
  const getConstraints = useCallback(() => ({
    video: {
      facingMode,
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      frameRate: { ideal: 30 }
    },
    audio: false
  }), [facingMode]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia(getConstraints());
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      setCameraError(error.message || 'Failed to access camera');
      setCameraActive(false);
    }
  }, [getConstraints]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) throw new Error('Canvas context not available');

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply flash effect
      if (flashEnabled) {
        document.body.style.backgroundColor = 'white';
        setTimeout(() => {
          document.body.style.backgroundColor = '';
        }, 150);
      }

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add timestamp overlay
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(10, canvas.height - 50, 300, 35);
      context.fillStyle = 'white';
      context.font = '16px Arial';
      context.fillText(
        new Date().toLocaleString(),
        15,
        canvas.height - 25
      );

      // Add delivery ID overlay
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(canvas.width - 200, 10, 190, 35);
      context.fillStyle = 'white';
      context.fillText(`Delivery: ${deliveryId}`, canvas.width - 195, 35);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate file size
      const byteString = atob(dataUrl.split(',')[1]);
      const size = byteString.length;

      const photo: CapturedPhoto = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dataUrl,
        timestamp: Date.now(),
        size
      };

      setCapturedPhotos(prev => [...prev, photo]);

      // Provide visual feedback
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0.8;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 100);

    } catch (error) {
      console.error('Photo capture failed:', error);
      setCameraError('Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  }, [deliveryId, flashEnabled, isCapturing]);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  // Delete photo
  const deletePhoto = useCallback((photoId: string) => {
    setCapturedPhotos(prev => prev.filter(p => p.id !== photoId));
  }, []);

  // Save photos
  const savePhotos = useCallback(() => {
    const photoDataUrls = capturedPhotos.map(p => p.dataUrl);
    onPhotoCaptured(photoDataUrls);
    stopCamera();
    onClose();
  }, [capturedPhotos, onPhotoCaptured, stopCamera, onClose]);

  // Close without saving
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // File input fallback
  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const photo: CapturedPhoto = {
          id: `file_${Date.now()}_${index}`,
          dataUrl,
          timestamp: Date.now(),
          size: file.size
        };
        setCapturedPhotos(prev => [...prev, photo]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Update camera when facing mode changes
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [facingMode, startCamera, cameraActive]);

  const canCaptureMore = capturedPhotos.length < maxPhotos;
  const hasMinPhotos = !required || capturedPhotos.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-lg font-bold">Delivery Photos</h2>
            <p className="text-sm opacity-80">
              {deliveryId} • {capturedPhotos.length}/{maxPhotos} photos
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Camera Error */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Camera className="h-5 w-5" />
                Camera Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{cameraError}</p>
              <div className="space-y-3">
                <Button onClick={startCamera} className="w-full">
                  Try Again
                </Button>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Choose from Gallery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Camera View */}
      {cameraActive && !cameraError && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
            <div className="flex items-center justify-between mb-4">
              {/* Camera Settings */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className="text-white"
                >
                  {flashEnabled ? <FlashOn className="h-5 w-5" /> : <FlashOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={switchCamera}
                  className="text-white"
                >
                  <SwitchCamera className="h-5 w-5" />
                </Button>
              </div>

              {/* Photo Count */}
              <Badge variant="secondary">
                {capturedPhotos.length} / {maxPhotos}
              </Badge>
            </div>

            {/* Capture Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Photo Gallery */}
              {capturedPhotos.length > 0 && (
                <div className="flex gap-2">
                  {capturedPhotos.slice(-3).map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.dataUrl}
                        alt="Captured"
                        className="w-12 h-12 object-cover rounded border-2 border-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Capture Button */}
              <Button
                onClick={capturePhoto}
                disabled={!canCaptureMore || isCapturing}
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
              >
                <Camera className="h-6 w-6" />
              </Button>

              {/* Done Button */}
              <Button
                onClick={savePhotos}
                disabled={!hasMinPhotos}
                variant="outline"
                className="text-white border-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Photo Review */}
      {capturedPhotos.length > 0 && (
        <div className="absolute top-16 right-4 w-32 space-y-2 max-h-96 overflow-y-auto">
          {capturedPhotos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.dataUrl}
                alt="Captured"
                className="w-full h-24 object-cover rounded border-2 border-white"
              />
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-white" />
              </button>
              <div className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                {(photo.size / 1024).toFixed(0)}KB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Canvas for Photo Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DeliveryCamera; 