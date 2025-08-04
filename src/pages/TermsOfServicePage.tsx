import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              These Terms of Service ("Terms") govern your use of the MyPartsRunner™ mobile application, website, and services (collectively, the "Service") operated by MyPartsRunner™ ("we," "our," or "us").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              MyPartsRunner™ is a platform that connects customers with auto parts stores and delivery drivers to facilitate the purchase and delivery of auto parts and hardware supplies.
            </p>
            <p>
              Our Service includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
              <li>Product browsing and ordering</li>
              <li>Payment processing</li>
              <li>Delivery coordination</li>
              <li>Order tracking</li>
              <li>Customer support</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Creation</h3>
              <p className="text-muted-foreground">
                To use certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Account Security</h3>
              <p className="text-muted-foreground">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Account Termination</h3>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at any time, with or without cause, with or without notice, effective immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Responsibilities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide accurate delivery information</li>
                <li>Be available for delivery at the specified time</li>
                <li>Pay for orders in full</li>
                <li>Treat drivers and merchants with respect</li>
                <li>Report any issues promptly</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Driver Responsibilities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Maintain valid driver's license and insurance</li>
                <li>Follow traffic laws and safety regulations</li>
                <li>Handle orders with care</li>
                <li>Update delivery status accurately</li>
                <li>Maintain professional conduct</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Merchant Responsibilities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide accurate product information</li>
                <li>Maintain adequate inventory</li>
                <li>Prepare orders promptly</li>
                <li>Ensure product quality and safety</li>
                <li>Resolve customer issues professionally</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Payment Methods</h3>
              <p className="text-muted-foreground">
                We accept various payment methods including credit cards, debit cards, and digital payment services. All payments are processed securely through third-party payment processors.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Pricing</h3>
              <p className="text-muted-foreground">
                Prices for products and services are subject to change without notice. Delivery fees may vary based on distance and order size.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Refunds</h3>
              <p className="text-muted-foreground">
                Refund policies are determined by individual merchants. We will assist in facilitating refunds according to merchant policies and applicable laws.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Delivery Times</h3>
              <p className="text-muted-foreground">
                Estimated delivery times are provided at checkout but may vary due to factors beyond our control, including traffic, weather, and order volume.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Delivery Instructions</h3>
              <p className="text-muted-foreground">
                Customers must provide clear delivery instructions and ensure someone is available to receive the order. We are not responsible for delivery delays due to customer unavailability.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Failed Deliveries</h3>
              <p className="text-muted-foreground">
                If delivery cannot be completed due to customer unavailability or incorrect information, additional fees may apply for redelivery attempts.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prohibited Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You agree not to use our Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our Service</li>
              <li>Use the Service for illegal or unauthorized purposes</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to defraud or deceive other users</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by MyPartsRunner™ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works of any content from our Service without our express written consent.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To the maximum extent permitted by law, MyPartsRunner™ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            <p>
              Our total liability to you for any claims arising from the use of our Service shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You agree to defend, indemnify, and hold harmless MyPartsRunner™ and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Arbitration</h3>
              <p className="text-muted-foreground">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Class Action Waiver</h3>
              <p className="text-muted-foreground">
                You agree that any arbitration will be conducted on an individual basis and not as a class action or other representative proceeding.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p>
              Your continued use of the Service after any changes constitutes acceptance of the new Terms. If you do not agree to the new terms, you must stop using the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Severability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Entire Agreement</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These Terms constitute the entire agreement between you and MyPartsRunner™ regarding the use of our Service, superseding any prior agreements between you and MyPartsRunner™ relating to your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: legal@mypartsrunner.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Auto Plaza, Dallas, TX 75001</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfServicePage;