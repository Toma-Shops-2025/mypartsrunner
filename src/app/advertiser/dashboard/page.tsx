import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart2,
  DollarSign,
  Image,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { getAdStats } from '@/lib/ad-analytics';
import { supabase } from '@/lib/supabase';

interface PageProps {
  searchParams: { session_id?: string };
}

async function getAdvertiserAds(userId: string) {
  const { data: ads, error } = await supabase
    .from('ads')
    .select('*')
    .eq('advertiser_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch stats for each ad
  const adsWithStats = await Promise.all(
    (ads || []).map(async (ad) => {
      const stats = await getAdStats(ad.id);
      return { ...ad, stats };
    })
  );

  return adsWithStats;
}

export default async function AdvertiserDashboard({ searchParams }: PageProps) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Please log in to access your advertiser dashboard</h1>
      </div>
    );
  }

  const ads = await getAdvertiserAds(user.id);

  // Calculate summary statistics
  const totalSpent = ads.reduce((sum, ad) => sum + (ad.total_price || 0), 0);
  const totalViews = ads.reduce((sum, ad) => sum + (ad.stats?.views || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.stats?.clicks || 0), 0);
  const averageCTR = totalViews ? (totalClicks / totalViews) * 100 : 0;

  // Group ads by status
  const activeAds = ads.filter(ad => {
    const today = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    return ad.status === 'approved' && startDate <= today && today <= endDate;
  });

  const pendingAds = ads.filter(ad => ad.status === 'pending');
  const completedAds = ads.filter(ad => {
    const today = new Date();
    const endDate = new Date(ad.end_date);
    return ad.status === 'approved' && today > endDate;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Advertiser Dashboard</h1>

      {searchParams.session_id && (
        <Card className="mb-6 bg-green-50 dark:bg-green-900">
          <CardContent className="pt-6">
            <p className="text-green-600 dark:text-green-400">
              Payment successful! Your ad will be reviewed shortly.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Average CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCTR.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeAds.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAds.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {activeAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
            {activeAds.length === 0 && (
              <EmptyState message="No active ads" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
            {pendingAds.length === 0 && (
              <EmptyState message="No pending ads" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {completedAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
            {completedAds.length === 0 && (
              <EmptyState message="No completed ads" />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdCard({ ad }: { ad: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {ad.image_url && (
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold">{ad.title}</h3>
            <p className="text-sm text-muted-foreground">{ad.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{ad.location}</Badge>
              <Badge
                variant={
                  ad.status === 'pending' ? 'secondary' :
                  ad.status === 'approved' ? 'default' : 'destructive'
                }
              >
                {ad.status}
              </Badge>
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4" />
                {ad.stats?.views || 0} views
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {ad.stats?.clicks || 0} clicks
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {((ad.stats?.ctr || 0) * 100).toFixed(2)}% CTR
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  );
} 