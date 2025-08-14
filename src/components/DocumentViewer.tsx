import React, { useState } from 'react';
import { Eye, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DocumentViewerProps {
  title: string;
  url?: string;
  required?: boolean;
  className?: string;
}

export function DocumentViewer({ title, url, required = false, className = "" }: DocumentViewerProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isImage = url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp'));
  const isPDF = url && url.includes('.pdf');

  const handleDownload = () => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${isPDF ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = () => {
    if (url) {
      if (isImage) {
        setIsPreviewOpen(true);
      } else if (isPDF) {
        window.open(url, '_blank');
      }
    }
  };

  if (!url) {
    return (
      <Card className={`border-dashed ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs">No document uploaded</p>
            {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="secondary" className="text-xs">
              {isPDF ? 'PDF' : 'Image'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            {isImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            
            {isPDF && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                View PDF
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {isPreviewOpen && isImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img 
              src={url} 
              alt={title}
              className="max-w-full max-h-full object-contain rounded"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="mt-4 mx-auto block"
            >
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </>
  );
} 