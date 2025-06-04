import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface AdLocation {
  id: string;
  name: string;
  description: string;
  type: string;
  dimensions: string;
  price_per_day: number;
  max_duration_days: number;
  is_available: boolean;
}

interface AdLocationBooking {
  start_date: string;
  end_date: string;
  ad_id: string;
}

const AdSpaceMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [locations, setLocations] = useState<AdLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<AdLocation | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [bookings, setBookings] = useState<Record<string, AdLocationBooking[]>>({});
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdLocations();
  }, []);

  const fetchAdLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_locations')
        .select('*')
        .order('price_per_day', { ascending: true });

      if (error) throw error;

      setLocations(data || []);

      // Fetch bookings for each location
      const bookingsPromises = data?.map(async (location) => {
        const { data: bookingData, error: bookingError } = await supabase
          .from('ad_location_bookings')
          .select('*')
          .eq('location_id', location.id)
          .gte('end_date', new Date().toISOString());

        if (bookingError) throw bookingError;

        return {
          locationId: location.id,
          bookings: bookingData || [],
        };
      });

      if (bookingsPromises) {
        const bookingsResults = await Promise.all(bookingsPromises);
        const bookingsMap: Record<string, AdLocationBooking[]> = {};
        bookingsResults.forEach(({ locationId, bookings }) => {
          bookingsMap[locationId] = bookings;
        });
        setBookings(bookingsMap);
      }
    } catch (error) {
      console.error('Error fetching ad locations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load ad spaces. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBookNow = (location: AdLocation) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book ad spaces.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedLocation(location);
    setIsBookingDialogOpen(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedLocation || !selectedDates.from || !selectedDates.to) return 0;
    const days = Math.ceil(
      (selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    return selectedLocation.price_per_day * days;
  };

  const handleConfirmBooking = async () => {
    if (!selectedLocation || !selectedDates.from || !selectedDates.to || !user) return;

    try {
      // Create the ad first
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .insert({
          title: `${selectedLocation.name} Booking`,
          description: `Ad space booking for ${selectedLocation.name}`,
          image_url: '', // Will be updated later
          link_url: '', // Will be updated later
          location: selectedLocation.id,
          start_date: selectedDates.from.toISOString(),
          end_date: selectedDates.to.toISOString(),
          advertiser_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (adError) throw adError;

      // Create the booking
      const { error: bookingError } = await supabase
        .from('ad_location_bookings')
        .insert({
          location_id: selectedLocation.id,
          start_date: selectedDates.from.toISOString(),
          end_date: selectedDates.to.toISOString(),
          ad_id: adData.id
        });

      if (bookingError) throw bookingError;

      toast({
        title: 'Success',
        description: 'Ad space booked successfully! Please complete your ad details.',
      });

      // Redirect to ad details page
      navigate(`/advertiser/dashboard?ad=${adData.id}`);
    } catch (error) {
      console.error('Error booking ad space:', error);
      toast({
        title: 'Error',
        description: 'Failed to book ad space. Please try again.',
        variant: 'destructive',
      });
    }

    setIsBookingDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Ad Space Marketplace</h1>
      <p className="text-gray-600 mb-8">
        Choose from our premium advertising locations to promote your business
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle>{location.name}</CardTitle>
              <CardDescription>{location.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{location.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span className="font-medium">{location.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per day:</span>
                  <span className="font-medium">${location.price_per_day.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum duration:</span>
                  <span className="font-medium">{location.max_duration_days} days</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleBookNow(location)}
                disabled={!location.is_available}
              >
                {location.is_available ? 'Book Now' : 'Currently Unavailable'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Ad Space</DialogTitle>
            <DialogDescription>
              Select your desired booking dates for {selectedLocation?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Calendar
              mode="range"
              selected={{
                from: selectedDates.from,
                to: selectedDates.to,
              }}
              onSelect={(range) => {
                setSelectedDates({
                  from: range?.from,
                  to: range?.to,
                });
              }}
              disabled={(date) => {
                if (!selectedLocation) return false;
                // Check if date is in any existing booking
                return bookings[selectedLocation.id]?.some(
                  (booking) =>
                    date >= new Date(booking.start_date) &&
                    date <= new Date(booking.end_date)
                );
              }}
              numberOfMonths={2}
            />

            <div className="flex justify-between items-center">
              <span>Total Price:</span>
              <span className="text-xl font-bold">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdSpaceMarketplace; 