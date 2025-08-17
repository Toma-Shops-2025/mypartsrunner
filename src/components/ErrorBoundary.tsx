import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isReporting: boolean;
  reportSent: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isReporting: false,
      reportSent: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (in production)
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error monitoring service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    try {
      // Simulate error reporting
      console.log('Error Report:', errorReport);
      
      // In production:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        reportSent: false
      });
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleSendReport = async () => {
    this.setState({ isReporting: true });
    
    try {
      // Simulate sending detailed report
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({ 
        isReporting: false, 
        reportSent: true 
      });
    } catch (error) {
      this.setState({ isReporting: false });
    }
  };

  private copyErrorDetails = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
    `;
    
    navigator.clipboard.writeText(errorDetails.trim());
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, isReporting, reportSent } = this.state;
      const isRetryDisabled = this.retryCount >= this.maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-6">
            {/* Main Error Card */}
            <Card className="border-red-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-800">
                  Oops! Something went wrong
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  We're sorry, but something unexpected happened. Our team has been notified.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Error Summary */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bug className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800">Error Details</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {error?.message || 'An unexpected error occurred'}
                      </p>
                      {this.retryCount > 0 && (
                        <p className="text-xs text-red-600 mt-2">
                          Retry attempts: {this.retryCount}/{this.maxRetries}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={this.handleRetry}
                    disabled={isRetryDisabled}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isRetryDisabled ? 'Reload Page' : 'Try Again'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={this.handleGoHome}
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                {/* Error Reporting */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Help us improve</h4>
                    {reportSent ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Report Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Optional
                      </Badge>
                    )}
                  </div>
                  
                  {!reportSent ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={this.handleSendReport}
                        disabled={isReporting}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {isReporting ? 'Sending...' : 'Send Error Report'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={this.copyErrorDetails}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Details
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">
                      Thank you! Your report helps us fix issues and improve the platform.
                    </p>
                  )}
                </div>

                {/* Development Info */}
                {process.env.NODE_ENV === 'development' && error && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Developer Details
                    </summary>
                    <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs font-mono">
                      <div className="mb-3">
                        <strong>Error:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-red-600">
                          {error.message}
                        </pre>
                      </div>
                      <div className="mb-3">
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-gray-800">
                          {error.stack}
                        </pre>
                      </div>
                      {errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap text-blue-600">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-medium text-gray-900 mb-2">Need immediate help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team if this problem persists.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    support@mypartsrunner.com
                  </Button>
                  <Button variant="outline" size="sm">
                    📞 1-800-PARTS-RUN
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 