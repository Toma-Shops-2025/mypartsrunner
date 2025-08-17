import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Car, Package, DollarSign, Users } from 'lucide-react';

// Generic Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

// Page Loading Screen
export const PageLoader: React.FC<{ title?: string; subtitle?: string }> = ({ 
  title = 'Loading', 
  subtitle = 'Please wait while we load your content...' 
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  </div>
);

// Card Loading Skeleton
export const CardSkeleton: React.FC<{ showHeader?: boolean; rows?: number }> = ({ 
  showHeader = true, 
  rows = 3 
}) => (
  <Card>
    {showHeader && (
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
    )}
    <CardContent className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </CardContent>
  </Card>
);

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Stats Cards Skeleton
export const StatsCardsSkeleton: React.FC = () => {
  const icons = [DollarSign, Users, Package, Car];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {icons.map((Icon, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <Icon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <Card>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-80' }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
    </CardHeader>
    <CardContent>
      <div className={`${height} flex items-end justify-center gap-2 p-4`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-8 bg-gradient-to-t from-gray-200 to-gray-100" 
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Navigation Skeleton
export const NavigationSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ showAvatar?: boolean; showActions?: boolean }> = ({ 
  showAvatar = true, 
  showActions = true 
}) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-4">
      {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
    {showActions && (
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    )}
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </CardContent>
  </Card>
);

// Activity Feed Skeleton
export const ActivityFeedSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-56" />
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </CardContent>
  </Card>
);

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardsSkeleton />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartSkeleton />
          <TableSkeleton />
        </div>
        <div className="space-y-6">
          <ActivityFeedSkeleton />
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Full Page Loading with Brand
export const BrandedPageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Loading MyPartsRunner...' 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Car className="h-10 w-10 text-white animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">MyPartsRunner</h1>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span className="text-gray-600">{message}</span>
      </div>
      <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  </div>
);

export default {
  LoadingSpinner,
  PageLoader,
  CardSkeleton,
  ProductGridSkeleton,
  StatsCardsSkeleton,
  TableSkeleton,
  ChartSkeleton,
  NavigationSkeleton,
  ListItemSkeleton,
  FormSkeleton,
  ActivityFeedSkeleton,
  DashboardSkeleton,
  SearchResultsSkeleton,
  BrandedPageLoader
}; 