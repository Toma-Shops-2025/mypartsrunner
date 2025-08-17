import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, User } from 'lucide-react';

interface DemoLoginProps {
  onUseDemoCredentials: (email: string, password: string) => void;
}

export const DemoLogin: React.FC<DemoLoginProps> = ({ onUseDemoCredentials }) => {
  const demoEmail = 'demo@mypartsrunner.com';
  const demoPassword = 'demo123';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="mt-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
          <User className="h-4 w-4" />
          🚀 Demo Access Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-blue-700">
          Use these credentials to test the platform features:
        </p>
        
        <div className="space-y-2 text-sm bg-white p-3 rounded border font-mono">
          <div className="flex items-center justify-between">
            <span><strong>Email:</strong> {demoEmail}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(demoEmail)}
              className="h-6 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span><strong>Password:</strong> {demoPassword}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(demoPassword)}
              className="h-6 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onUseDemoCredentials(demoEmail, demoPassword)}
        >
          📋 Auto-Fill Demo Credentials
        </Button>

        <div className="text-xs text-blue-600 text-center">
          💡 Note: For real accounts, please contact support
        </div>
      </CardContent>
    </Card>
  );
}; 