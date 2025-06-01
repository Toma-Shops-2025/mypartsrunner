import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700">By accessing and using TomaShops, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Payment Processing & Stripe Integration
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                TomaShops™ uses Stripe as our primary payment processor to ensure secure, reliable transactions. By using our platform, you agree to Stripe's terms of service and privacy policy.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Payment Security Features:
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>PCI DSS Level 1 compliance for maximum security</li>
                  <li>256-bit SSL encryption for all transactions</li>
                  <li>Advanced fraud detection and prevention</li>
                  <li>Real-time transaction monitoring</li>
                  <li>Secure tokenization of payment information</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Escrow Payment Protection
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                TomaShops™ implements an escrow payment system to protect both buyers and sellers in every transaction.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How Escrow Protection Works:</h4>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li><strong>Payment Hold:</strong> When you make a purchase, your payment is securely held in escrow by our payment processor</li>
                  <li><strong>Order Fulfillment:</strong> The seller is notified to ship your item and provide tracking information</li>
                  <li><strong>Delivery Confirmation:</strong> You have a specified period to confirm receipt and satisfaction with your purchase</li>
                  <li><strong>Fund Release:</strong> Once confirmed, funds are released to the seller. If issues arise, our dispute resolution process protects your interests</li>
                </ol>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Buyer Protection Includes:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Full refund if item is not as described</li>
                  <li>Protection against non-delivery</li>
                  <li>Dispute resolution support</li>
                  <li>Chargeback protection through Stripe</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>One person or legal entity may not maintain more than one account</li>
              <li>Payment information must be accurate and belong to the account holder</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transaction Terms</h2>
            <div className="space-y-3">
              <p className="text-gray-700">All transactions are processed through Stripe's secure payment infrastructure:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payments are held in escrow until delivery confirmation</li>
                <li>Sellers receive payment after successful transaction completion</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Transaction fees may apply as disclosed at checkout</li>
                <li>Currency conversion rates are determined by Stripe</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">You may not use our service:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To process fraudulent or unauthorized payments</li>
              <li>To circumvent our escrow protection system</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products and Services</h2>
            <p className="text-gray-700">All products and services are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. All payments are processed securely through Stripe.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-700">In case of disputes, our escrow system provides protection for both parties. We offer mediation services and work with Stripe's dispute resolution mechanisms to ensure fair outcomes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700">TomaShops shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. Our liability is limited to the escrow protection and dispute resolution services we provide.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700">Questions about the Terms of Service, payment processing, or escrow protection should be sent to us at legal@tomashops.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;