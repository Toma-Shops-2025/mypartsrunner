import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Shield, Users } from 'lucide-react';

const WhyChooseSection = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose TomaShops™?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <Video className="h-12 w-12 mx-auto text-blue-600 mb-2" />
            <CardTitle>Video-First Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Every product comes with detailed video demonstrations, giving you a complete understanding before you buy.</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Secure Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stripe-powered payments with escrow protection ensure your transactions are safe and secure.</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Users className="h-12 w-12 mx-auto text-purple-600 mb-2" />
            <CardTitle>Trusted Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Join thousands of verified buyers and sellers in our growing marketplace community.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhyChooseSection;