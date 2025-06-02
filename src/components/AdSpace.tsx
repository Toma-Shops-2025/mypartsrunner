import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { adPricing } from '@/lib/ad-pricing';
import { createCheckoutSession } from '@/lib/stripe';

interface AdSpaceProps {
  location: 'sidebar' | 'header' | 'footer' | 'content';
  size: 'small' | 'medium' | 'large';
}

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
  advertiser_id: string;
}

const sizeToClass = {
  small: 'h-[250px] w-[300px]',
  medium: 'h-[280px] w-[336px]',
  large: 'h-[400px] w-[970px]',
};

export const AdSpace: React.FC<AdSpaceProps> = ({ location, size }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    start_date: '',
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  const pricing = adPricing[location]?.[size];

  useEffect(() => {
    if (formData.start_date && formData.end_date && pricing) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * pricing.daily_rate);
    } else {
      setTotalPrice(0);
    }
  }, [formData.start_date, formData.end_date, pricing]);

  const validateDates = (start: string, end: string): boolean => {
    if (!pricing) return false;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate days
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Validation checks
    if (startDate < today) {
      toast({
        title: 'Invalid dates',
        description: 'Start date must be today or later',
        variant: 'destructive',
      });
      return false;
    }

    if (days < pricing.min_days) {
      toast({
        title: 'Invalid duration',
        description: `Minimum duration is ${pricing.min_days} days`,
        variant: 'destructive',
      });
      return false;
    }

    if (days > pricing.max_days) {
      toast({
        title: 'Invalid duration',
        description: `Maximum duration is ${pricing.max_days} days`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: 'Error',
          description: 'Please login to submit an ad',
          variant: 'destructive',
        });
        return;
      }

      if (!validateDates(formData.start_date, formData.end_date)) {
        setIsSubmitting(false);
        return;
      }

      // Create the ad record first
      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert([
          {
            ...formData,
            location,
            status: 'draft',
            advertiser_id: user.data.user.id,
            total_price: totalPrice,
          },
        ])
        .select()
        .single();

      if (adError) throw adError;

      // Create Stripe checkout session
      await createCheckoutSession({
        adId: ad.id,
        totalAmount: totalPrice,
        locationName: location,
        startDate: formData.start_date,
        endDate: formData.end_date,
      });

      // The user will be redirected to Stripe's checkout page
    } catch (error) {
      console.error('Error submitting ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit ad',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!pricing) {
    return null; // Don't render if no pricing is available for this location/size combination
  }

  return (
    <Card className={`relative overflow-hidden ${sizeToClass[size]} bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-xl font-bold mb-2">Advertise Here!</h3>
        <p className="text-sm mb-4 text-muted-foreground">
          Reach our growing community of buyers and sellers
        </p>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              Place Your Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Your Advertisement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link_url">Destination URL</Label>
                <Input
                  id="link_url"
                  name="link_url"
                  type="url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2">Pricing Details</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Daily Rate: ${pricing.daily_rate.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Duration: {pricing.min_days}-{pricing.max_days} days
                </p>
                {totalPrice > 0 && (
                  <p className="text-lg font-bold mt-2">
                    Total: ${totalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Submit Ad for Review'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Size: {size}</p>
          <p>Location: {location}</p>
          <p className="mt-1">From ${pricing.daily_rate.toFixed(2)}/day</p>
        </div>
      </div>
    </Card>
  );
}; 