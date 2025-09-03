import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/ui/back-button';
import { 
  Zap, 
  Target, 
  Users, 
  Heart, 
  Award, 
  MapPin, 
  Calendar, 
  Star,
  CheckCircle,
  Clock,
  Shield,
  Lightbulb,
  Rocket
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "30-minute delivery guarantee",
      color: "text-cyan-400"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted & Safe",
      description: "Verified drivers and secure payments",
      color: "text-green-400"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Customer First",
      description: "Your satisfaction is our priority",
      color: "text-pink-400"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Parts",
      description: "Only genuine and verified parts",
      color: "text-purple-400"
    }
  ];

  const stats = [
    { value: "10K+", label: "Parts Delivered", icon: <CheckCircle className="w-5 h-5" /> },
    { value: "500+", label: "Daily Deliveries", icon: <Clock className="w-5 h-5" /> },
    { value: "4.9★", label: "Customer Rating", icon: <Star className="w-5 h-5" /> },
    { value: "30min", label: "Avg Delivery Time", icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <BackButton 
            variant="ghost" 
            className="mr-4 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors"
          />
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">About</span>{' '}
            <span className="neon-text">MyPartsRunner</span>
          </h1>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-neon">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">About</span>{' '}
            <span className="neon-text">MyPartsRunner™</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Louisville's premier auto parts and hardware delivery service, revolutionizing how you get the parts you need, when you need them.
          </p>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-8 border border-cyan-400/30 glow-card mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-cyan-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold neon-text mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <Card className="glass-card border-0 shadow-2xl glow-card mb-12">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-cyan-400" />
              <span className="gradient-text">Our Mission</span>
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg max-w-2xl mx-auto">
              Connecting auto parts suppliers with customers through lightning-fast delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              MyPartsRunner™ is dedicated to revolutionizing the auto parts delivery industry by providing a seamless platform 
              that connects suppliers, drivers, and customers. Our mission is to ensure that auto parts and hardware supplies 
              are delivered in 30 minutes or less, minimizing downtime for mechanics, auto shops, and DIY enthusiasts across Louisville.
            </p>
          </CardContent>
        </Card>

        {/* Our Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Our</span>{' '}
            <span className="neon-text">Story</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glass-card p-8 border border-purple-400/30 glow-card">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Founded in 2024</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                MyPartsRunner™ emerged from the recognition that Louisville's auto parts delivery system was fragmented and inefficient. 
                Our founders, with backgrounds in automotive repair and technology, set out to create a solution that would streamline 
                the process of ordering and delivering auto parts.
              </p>
            </div>

            <div className="glass-card p-8 border border-green-400/30 glow-card">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Louisville, Kentucky</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Starting in Louisville's Metro area, we've built strong partnerships with local auto parts stores, hardware suppliers, 
                and a dedicated fleet of drivers. Our deep understanding of the local market drives our commitment to the community.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Our</span>{' '}
            <span className="neon-text">Values</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="glass-card border-0 shadow-xl glow-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`${value.color} mb-4 flex justify-center`}>
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Meet Our</span>{' '}
            <span className="neon-text">Team</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-0 shadow-2xl glow-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-cyan-400" />
                  <span className="gradient-text">Leadership</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">TA</span>
                    </div>
                    <div>
                      <p className="font-bold text-white">TomaAdkins</p>
                      <p className="text-cyan-400 text-sm">Founder & CEO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span>Louisville, Kentucky</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-0 shadow-2xl glow-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <span className="gradient-text">Technology</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    Our tech team is powered by cutting-edge AI and modern web technologies to ensure lightning-fast deliveries and seamless user experiences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-cyan-400 to-purple-600 text-black">React</Badge>
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-600 text-black">TypeScript</Badge>
                    <Badge className="bg-gradient-to-r from-green-400 to-cyan-600 text-black">Supabase</Badge>
                    <Badge className="bg-gradient-to-r from-pink-400 to-purple-600 text-black">Stripe</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="glass-card border border-cyan-400/30 glow-card p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="gradient-text">Ready to Experience</span>{' '}
              <span className="neon-text">Lightning Fast Delivery?</span>
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of satisfied customers in Louisville who trust MyPartsRunner™ for their auto parts needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register?role=customer" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Get Started as Customer
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400 hover:text-black transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
