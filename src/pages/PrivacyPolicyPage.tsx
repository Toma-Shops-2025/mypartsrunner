import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              MyPartsRunner™ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, and services (collectively, the "Service").
            </p>
            <p>
              By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            <CardDescription>
              We collect several types of information from and about users of our Service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground mb-2">
                We may collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Delivery addresses and location information</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Driver's license and vehicle information (for drivers)</li>
                <li>Business information (for merchants)</li>
                <li>Profile pictures and identification documents</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <p className="text-muted-foreground mb-2">
                We automatically collect certain information about your use of our Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Log information (access times, pages viewed, IP address)</li>
                <li>Location information (with your consent)</li>
                <li>Usage patterns and preferences</li>
                <li>Communication preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Location Information</h3>
              <p className="text-muted-foreground">
                We collect location information to provide delivery services, track orders, and improve our Service. You can control location permissions through your device settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process and fulfill orders</li>
              <li>Connect customers with drivers and merchants</li>
              <li>Send notifications about orders and deliveries</li>
              <li>Process payments and prevent fraud</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and abuse</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Providers</h3>
              <p className="text-muted-foreground">
                We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Partners</h3>
              <p className="text-muted-foreground">
                We may share limited information with merchants and drivers to facilitate deliveries and provide customer service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Transfers</h3>
              <p className="text-muted-foreground">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Access and Update</h3>
              <p className="text-muted-foreground">
                You can access and update your personal information through your account settings or by contacting us.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Deletion</h3>
              <p className="text-muted-foreground">
                You can request deletion of your account and personal information, subject to certain legal and contractual obligations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Marketing Communications</h3>
              <p className="text-muted-foreground">
                You can opt out of marketing communications by following the unsubscribe instructions in our emails or updating your preferences in your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Location Services</h3>
              <p className="text-muted-foreground">
                You can control location permissions through your device settings. Note that some features may not work without location access.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. We may retain certain information for longer periods to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <p>
              When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our Service after any changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: privacy@mypartsrunner.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Auto Plaza, Dallas, TX 75001</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>California Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Right to know what personal information we collect and how we use it</li>
              <li>Right to delete your personal information</li>
              <li>Right to opt out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;