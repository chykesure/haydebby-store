'use client';

import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BRAND = {
  teal: '#1A9B8C',
  orange: '#F5A623',
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: BRAND.teal }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="haydebby logo"
                width={150}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Premium smart kitchen appliances for the modern Nigerian home.
              AI-enhanced, durable, and affordable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Shop All', 'Featured', 'New Arrivals', 'Best Sellers'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-white/80 hover:text-white transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {['Contact Us', 'Shipping Policy', 'Returns & Warranty', 'FAQs'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-white/80 hover:text-white transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-4 w-4 shrink-0" />
                +234 801 234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Mail className="h-4 w-4 shrink-0" />
                hello@haydebby.ng
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                12, Adeniyi Jones Avenue, Ikeja, Lagos
              </li>
            </ul>

            {/* WhatsApp Button */}
            <Button
              className="mt-4 font-medium text-sm"
              size="sm"
              style={{ backgroundColor: '#25D366', color: 'white' }}
              onClick={() => {
                window.open('https://wa.me/2348012345678', '_blank');
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} haydebby. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>·</span>
            <button className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
