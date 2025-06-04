import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface AdStats {
  views: number;
  clicks: number;
  ctr: number;
}

interface AdLocation {
  id: string;
  name: string;
  type: string;
  dimensions: string;
}

const AdvertiserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [adStats, setAdStats] = useState<Record<string, AdStats>>({});
  const [locations, setLocations] = useState<Record<string, AdLocation>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchAds();
      fetchLocations();
    }
  }, [user]);

  useEffect(() => {
    const adId = searchParams.get('ad');
    if (adId) {
      const ad = ads.find(a => a.id === adId);
      if (ad) {
        setSelectedAd(ad);
        setFormData({
          title: ad.title,
          description: ad.description,
          image_url: ad.image_url,
          link_url: ad.link_url,
        });
        setIsEditDialogOpen(true);
      }
    }
  }, [searchParams, ads]);

  const fetchAds = async () => {
    try {
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('advertiser_id', user?.id)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      setAds(adsData || []);

      // Fetch stats for each ad
      const statsPromises = adsData?.map(async (ad) => {
        const [viewsData, clicksData] = await Promise.all([
          supabase
            .from('ad_views')
            .select('count', { count: 'exact' })
            .eq('ad_id', ad.id),
          supabase
            .from('ad_clicks')
            .select('count', { count: 'exact' })
            .eq('ad_id', ad.id),
        ]);

        const views = viewsData.count || 0;
        const clicks = clicksData.count || 0;
        const ctr = views > 0 ? (clicks / views) * 100 : 0;

        return {
          adId: ad.id,
          stats: { views, clicks, ctr },
        };
      });

      if (statsPromises) {
        const statsResults = await Promise.all(statsPromises);
        const statsMap: Record<string, AdStats> = {};
        statsResults.forEach(({ adId, stats }) => {
          statsMap[adId] = stats;
        });
        setAdStats(statsMap);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your advertisements.',
        variant: 'destructive',
      });
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_locations')
        .select('*');

      if (error) throw error;

      const locationMap: Record<string, AdLocation> = {};
      data?.forEach((location) => {
        locationMap[location.id] = location;
      });
      setLocations(locationMap);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleUpdateAd = async () => {
    if (!selectedAd) return;

    try {
      const { error } = await supabase
        .from('ads')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          link_url: formData.link_url,
        })
        .eq('id', selectedAd.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Advertisement updated successfully.',
      });

      fetchAds();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to update advertisement.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Advertisements</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              View the performance metrics of your advertisements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>{ad.title}</TableCell>
                    <TableCell>{locations[ad.location]?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          ad.status
                        )}`}
                      >
                        {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{adStats[ad.id]?.views || 0}</TableCell>
                    <TableCell>{adStats[ad.id]?.clicks || 0}</TableCell>
                    <TableCell>
                      {(adStats[ad.id]?.ctr || 0).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAd(ad);
                          setFormData({
                            title: ad.title,
                            description: ad.description,
                            image_url: ad.image_url,
                            link_url: ad.link_url,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Advertisement</DialogTitle>
              <DialogDescription>
                Update your advertisement details below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) =>
                    setFormData({ ...formData, link_url: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAd}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdvertiserDashboard; 