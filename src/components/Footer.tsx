import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <img src="/images/kklogo.jfif" alt="Kuya Kards Logo" className="h-14 w-14 rounded-lg" />
              <div>
                <h3 className="text-2xl font-bold text-white">KUYA KARDS</h3>
                <p className="text-sm text-gray-300">Motorcycle Trading</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Your trusted partner for premium motorcycle parts and accessories.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">OUR LOCATIONS</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Valenzuela City</p>
                  <p className="text-sm text-gray-300">20 G. Molina St., Canumay East</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Aurora Province</p>
                  <p className="text-sm text-gray-300">Brgy. Wenceslao, Maria Aurora</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">SERVICES</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-white mb-3">PAYMENT</h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>Cash on Delivery</li>
                  <li>GCash / Maya</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-3">DELIVERY</h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>LBC / J&T</li>
                  <li>Local Pickup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 Kuya Kards Motorcycle Trading. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
