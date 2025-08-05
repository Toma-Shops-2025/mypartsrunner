import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';

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
  subtitle = "Get the parts you need delivered quickly from local auto and hardware stores in Louisville, Kentucky and surrounding Jefferson County. Coming soon to Frankfort KY, Lexington KY, Indianapolis IN, Cincinnati OH, and more!",
  ctaText = "Get Started",
  ctaLink = "/register",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "/how-it-works",
  imageUrl = "https://d64gsuwffb70l.cloudfront.net/6828bd34e19b9a417662c460_1747502820250_5dcc0c63.png"
}) => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to={ctaLink}>
                <Button size="lg">{ctaText}</Button>
              </Link>
              <Link to={secondaryCtaLink}>
                <Button variant="outline" size="lg">{secondaryCtaText}</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="MyPartsRunner™ Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
