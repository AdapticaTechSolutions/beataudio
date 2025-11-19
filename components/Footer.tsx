import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from './icons';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-lightGray to-white border-t-2 border-mediumGray/50 mt-16 md:mt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center md:text-left mb-12">
          {/* Brand section */}
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <Logo className="h-12 sm:h-14 w-auto" theme="light" />
            </div>
            <p className="text-darkGray text-sm sm:text-base leading-relaxed max-w-xs mx-auto md:mx-0">
              Crafting unforgettable event experiences since 2015. Premium audio, lighting, and special effects for your most important moments.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-black mb-6 text-lg sm:text-xl">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-darkGray hover:text-primaryRed transition-colors duration-300 text-sm sm:text-base inline-block transform hover:translate-x-1">
                  Services
                </a>
              </li>
              <li>
                <a href="#packages" className="text-darkGray hover:text-primaryRed transition-colors duration-300 text-sm sm:text-base inline-block transform hover:translate-x-1">
                  Packages
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-darkGray hover:text-primaryRed transition-colors duration-300 text-sm sm:text-base inline-block transform hover:translate-x-1">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#contact" className="text-darkGray hover:text-primaryRed transition-colors duration-300 text-sm sm:text-base inline-block transform hover:translate-x-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-bold text-black mb-6 text-lg sm:text-xl">Follow Us</h4>
            <p className="text-darkGray text-sm sm:text-base mb-4">
              Stay connected and see our latest work
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border-2 border-mediumGray/50 flex items-center justify-center text-darkGray hover:text-primaryRed hover:border-primaryRed transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border-2 border-mediumGray/50 flex items-center justify-center text-darkGray hover:text-primaryRed hover:border-primaryRed transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border-2 border-mediumGray/50 flex items-center justify-center text-darkGray hover:text-primaryRed hover:border-primaryRed transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t-2 border-mediumGray/50 text-center">
          <p className="text-darkGray/70 text-sm sm:text-base mb-3">
            &copy; {new Date().getFullYear()} Beat Audio & Lights. All Rights Reserved.
          </p>
          <a 
            href="#/admin" 
            className="text-xs sm:text-sm text-darkGray/60 hover:text-primaryRed transition-colors duration-300 inline-block"
          >
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  );
};