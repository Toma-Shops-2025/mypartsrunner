import { Link } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { Logo } from '@/components/ui/Logo';

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-brand-blue">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Your Store</h3>
                <p className="text-muted-foreground">Browse local auto parts and hardware stores in your area.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-brand-blue">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
                <p className="text-muted-foreground">Select your parts and place your order for immediate delivery.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-brand-blue">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Get your parts delivered quickly by our trusted runners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Runner Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Become a Runner</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join our network of trusted runners and earn money delivering auto parts and hardware supplies. 
                Set your own schedule and be your own boss.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>Flexible hours - work when you want</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>Competitive pay with tips and bonuses</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>Simple app-based delivery system</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-brand-blue/10 rounded-full" />
              <div className="relative bg-white p-8 rounded-lg shadow-lg">
                <Logo className="mb-6" />
                <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Join our team of runners and start earning today. Quick application process and fast approval.
                </p>
                <a href="/become-runner" className="inline-block w-full bg-brand-blue text-white text-center py-3 rounded-lg hover:bg-brand-blue/90 transition-colors">
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-brand-blue/10 rounded-full" />
              <div className="relative bg-white p-8 rounded-lg shadow-lg">
                <Logo className="mb-6" />
                <h3 className="text-xl font-semibold mb-4">Partner With Us</h3>
                <p className="text-muted-foreground mb-6">
                  Join our platform and reach more customers. No subscription fees, just pay per delivery.
                </p>
                <a href="/merchant" className="inline-block w-full bg-brand-blue text-white text-center py-3 rounded-lg hover:bg-brand-blue/90 transition-colors">
                  Register Your Store
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">For Store Owners</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Expand your business with on-demand delivery. Reach more customers and increase sales 
                without managing your own delivery fleet.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>No subscription fees</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>Reliable delivery network</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-blue">✓</span>
                  </div>
                  <p>Easy-to-use merchant dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 