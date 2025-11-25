import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from './icons';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-mediumGray mt-16 md:mt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex justify-center md:justify-start">
              <Logo className="h-12 w-auto mb-2" theme="light" />
            </div>
            <p className="text-darkGray">Crafting unforgettable event experiences since 2015.</p>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-darkGray hover:text-primaryRed">Services</a></li>
              <li><a href="#portfolio" className="text-darkGray hover:text-primaryRed">Portfolio</a></li>
              <li><a href="#terms" className="text-darkGray hover:text-primaryRed">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://www.facebook.com/beataudiols" className="text-darkGray hover:text-primaryRed"><FacebookIcon /></a>
              <a href="https://www.instagram.com/beataudiols/" className="text-darkGray hover:text-primaryRed"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-mediumGray pt-8 text-center text-darkGray/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Beat Audio & Lights. All Rights Reserved.</p>
          <a href="#/admin" className="mt-2 inline-block text-xs hover:text-primaryRed">Admin Portal</a>
        </div>
      </div>
    </footer>
  );
};