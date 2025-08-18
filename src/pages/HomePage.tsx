import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Package, 
  Truck, 
  Clock, 
  Shield, 
  Star,
  MapPin,
  Users,
  Zap,
  Sparkles,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Auto Parts & Hardware",
      description: "Access thousands of parts from AutoZone, O'Reilly's, Home Depot & more",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Lightning Fast Delivery",
      description: "Get your parts delivered in 30 minutes or less, guaranteed",
      gradient: "from-pink-400 to-purple-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Need parts at midnight? We've got you covered, anytime anywhere",
      gradient: "from-green-400 to-cyan-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "Every part verified, every delivery tracked, every customer satisfied",
      gradient: "from-orange-400 to-pink-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Parts Available", icon: <Package className="w-6 h-6" /> },
    { value: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
    { value: "4.9★", label: "Rating", icon: <Star className="w-6 h-6" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Auto Mechanic",
      content: "MyPartsRunner saved my shop! Got brake pads delivered in 15 minutes. Game changer!",
      rating: 5,
      avatar: "🔧"
    },
    {
      name: "Sarah Chen", 
      role: "DIY Enthusiast",
      content: "Perfect for weekend projects. Quick delivery, genuine parts, fair prices.",
      rating: 5,
      avatar: "🛠️"
    },
    {
      name: "Dave Thompson",
      role: "Fleet Manager", 
      content: "Their business accounts feature keeps our trucks running 24/7. Incredible service!",
      rating: 5,
      avatar: "🚛"
    }
  ];

  return (
    <div className="min-h-screen animated-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <Badge className="px-4 py-2 mb-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold text-sm border-0 pulse-neon">
              <Sparkles className="w-4 h-4 mr-2" />
              LOUISVILLE'S #1 PARTS DELIVERY
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Parts</span>{' '}
              <span className="neon-text">Delivered</span>{' '}
              <span className="gradient-text">Fast</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get auto parts and hardware supplies delivered to your door in 
              <span className="neon-text-green"> 30 minutes or less</span>. 
              From brake pads to screws, we deliver everything you need, when you need it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/browse')}
                className="neon-button text-lg px-8 py-4 h-auto min-w-[200px]"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                onClick={() => navigate('/driver')}
                variant="outline"
                className="text-lg px-8 py-4 h-auto min-w-[200px] border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
              >
                <Truck className="mr-2 w-5 h-5" />
                Drive & Earn
              </Button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center glow-card">
                <div className="text-cyan-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold neon-text mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Why Choose</span>{' '}
              <span className="neon-text-pink">MyPartsRunner?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing parts delivery with cutting-edge technology and lightning-fast service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card border-0 glow-card group cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-black mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="neon-text-green">How It</span>{' '}
              <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-300">Simple, fast, reliable - parts delivery made easy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Your Parts",
                description: "Search our vast inventory of auto parts and hardware supplies",
                icon: <Package className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "Place Your Order",
                description: "Quick checkout with multiple payment options and delivery tracking",
                icon: <CheckCircle className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Get Delivered",
                description: "Professional drivers deliver your parts in 30 minutes or less",
                icon: <Truck className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="glass-card p-8 glow-card group">
                  <div className="text-6xl font-bold neon-text mb-4 pulse-neon">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Customer</span>{' '}
              <span className="neon-text-pink pulse-neon">Love</span>
            </h2>
            <p className="text-xl text-gray-300">See what our customers say about MyPartsRunner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card border-0 glow-card">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 glow-card">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Ready to</span>{' '}
              <span className="neon-text pulse-neon">Start?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of satisfied customers in Louisville. Get your parts delivered faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                className="neon-button text-lg px-8 py-4 h-auto"
              >
                <Users className="mr-2 w-5 h-5" />
                Join Now - Free
              </Button>
              <Button 
                onClick={() => navigate('/browse')}
                variant="outline"
                className="text-lg px-8 py-4 h-auto border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-all duration-300"
              >
                <TrendingUp className="mr-2 w-5 h-5" />
                Browse Parts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Badge */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-6 glow-card">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Proudly Serving Louisville, KY</span>
            </div>
            <p className="text-gray-400">
              More cities coming soon. Follow us for updates!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
