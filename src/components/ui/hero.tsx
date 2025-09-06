import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Truck, Wrench, Store, Star, ArrowRight } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Fast Delivery for Auto Parts & Hardware",
  subtitle = "Get the parts you need delivered quickly from local auto and hardware stores nationwide. Fast, reliable delivery to your door.",
  ctaText = "Get Started",
  ctaLink = "/register",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "/how-it-works",
  imageUrl = "/logo.png"
}) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(147, 51, 234, 0.85) 50%, rgba(239, 68, 68, 0.90) 100%), 
                           url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>')`
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 bg-white/10 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={imageUrl}
                alt="MyPartsRunner Logo"
                className="h-24 md:h-32 w-auto drop-shadow-2xl"
              />
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Fast Delivery for
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Auto Parts & Hardware
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
              Get the parts you need delivered quickly from local stores in 
              <span className="text-yellow-300 font-bold"> Nationwide </span>
              and surrounding areas. Coming soon to Frankfort, Lexington, Indianapolis, Cincinnati, and more!
            </p>
          </div>

          {/* Features Icons */}
          <div className="flex justify-center items-center space-x-8 md:space-x-12 py-8">
            <div className="flex flex-col items-center space-y-2 text-white/80">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Truck className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/80">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Store className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">Local Stores</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/80">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Wrench className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">Quality Parts</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/80">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">Trusted Service</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to={ctaLink}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={secondaryCtaLink}>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {secondaryCtaText}
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-12">
            <p className="text-white/70 text-sm mb-4">Trusted by mechanics, contractors, and DIY enthusiasts</p>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export { Hero };
