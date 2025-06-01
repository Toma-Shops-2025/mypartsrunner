import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CreditCard, Shield, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about TomaShops™ payments and security
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="stripe-integration">
                <AccordionTrigger className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Is Stripe fully integrated for payments?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Yes! TomaShops™ is fully integrated with Stripe, the world's leading payment processor. This means:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>PCI DSS Level 1 compliance for maximum security</li>
                      <li>256-bit SSL encryption for all transactions</li>
                      <li>Support for all major credit cards and digital wallets</li>
                      <li>Real-time fraud detection and prevention</li>
                      <li>Instant payment processing and confirmation</li>
                    </ul>
                    <p>Your payment information is never stored on our servers - it's securely handled by Stripe's infrastructure.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="escrow-protection">
                <AccordionTrigger className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  How does escrow protection work?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Our escrow system protects both buyers and sellers:</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">For Buyers:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Your payment is held securely until you confirm receipt</li>
                        <li>Full refund if item doesn't match description</li>
                        <li>Protection against non-delivery</li>
                        <li>Dispute resolution support</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">For Sellers:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Guaranteed payment once item is delivered</li>
                        <li>Protection against fraudulent chargebacks</li>
                        <li>Clear delivery confirmation process</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-methods">
                <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                <AccordionContent>
                  <p>Through our Stripe integration, we accept:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>All major credit cards (Visa, Mastercard, American Express, Discover)</li>
                    <li>Debit cards</li>
                    <li>Digital wallets (Apple Pay, Google Pay)</li>
                    <li>Bank transfers (ACH) for US customers</li>
                    <li>International payment methods in supported countries</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fees">
                <AccordionTrigger>Are there any payment fees?</AccordionTrigger>
                <AccordionContent>
                  <p>TomaShops™ keeps fees transparent and competitive:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>No fees for buyers - pay only the listed price</li>
                    <li>Small seller fee only charged on successful sales</li>
                    <li>Stripe processing fees are included in our seller fee</li>
                    <li>No hidden charges or surprise fees</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refunds">
                <AccordionTrigger>How do refunds work?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Our escrow system makes refunds simple and secure:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>If you're not satisfied, request a refund before confirming delivery</li>
                      <li>Funds are returned to your original payment method</li>
                      <li>Refunds typically process within 3-5 business days</li>
                      <li>Our support team mediates any disputes</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger>How secure are my transactions?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>We use industry-leading security measures:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Stripe's PCI DSS Level 1 certified infrastructure</li>
                      <li>End-to-end encryption for all payment data</li>
                      <li>Advanced fraud detection algorithms</li>
                      <li>Two-factor authentication available</li>
                      <li>Regular security audits and monitoring</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      Your payment information is never stored on our servers and is handled exclusively by Stripe's secure systems.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="international">
                <AccordionTrigger>Do you support international payments?</AccordionTrigger>
                <AccordionContent>
                  <p>Yes! Through Stripe, we support:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Payments from 40+ countries</li>
                    <li>Multiple currencies with automatic conversion</li>
                    <li>Local payment methods in supported regions</li>
                    <li>Compliance with international payment regulations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FAQSection;