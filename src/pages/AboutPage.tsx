import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutPage: React.FC = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About MyPartsRunner™</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Connecting auto parts suppliers with customers through efficient delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            MyPartsRunner™ is dedicated to revolutionizing the auto parts delivery industry by providing a seamless platform 
            that connects suppliers, drivers, and customers. Our mission is to ensure that auto parts and hardware supplies 
            are delivered quickly and efficiently, minimizing downtime for mechanics and DIY enthusiasts alike.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Our Story</h2>
      <p className="mb-6 text-muted-foreground">
        Founded in 2023, MyPartsRunner™ emerged from the recognition that the auto parts delivery system was fragmented and inefficient. 
        Our founders, with backgrounds in automotive repair and technology, set out to create a solution that would streamline 
        the process of ordering and delivering auto parts, benefiting all parties involved.
      </p>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="font-medium">John Doe - CEO & Co-Founder</li>
              <li className="font-medium">Jane Smith - CTO & Co-Founder</li>
              <li className="font-medium">Robert Johnson - COO</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Development</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="font-medium">Sarah Williams - Lead Developer</li>
              <li className="font-medium">Michael Brown - UX Designer</li>
              <li className="font-medium">David Miller - Backend Engineer</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">Have questions or feedback? We'd love to hear from you!</p>
          <p className="font-medium">Email: info@mypartsrunner.com</p>
          <p className="font-medium">Phone: (555) 123-4567</p>
          <p className="font-medium">Address: 123 Auto Plaza, Dallas, TX 75001</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
