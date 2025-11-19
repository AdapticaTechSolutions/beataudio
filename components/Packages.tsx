import React from 'react';
import { PACKAGES } from '../constants';
import { CheckCircleIcon } from './icons';

interface PackagesProps {
  onBookNowClick: () => void;
}

export const Packages: React.FC<PackagesProps> = ({ onBookNowClick }) => {
  return (
    <section id="packages" className="py-24 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Curated Packages
          </h2>
          <p className="text-lg sm:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed">
            Choose the perfect set for your event, or customize your own. Each package is carefully designed to create unforgettable moments.
          </p>
          <div className="mt-6 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved grid with better card design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {PACKAGES.map((pkg, index) => (
            <div 
              key={pkg.name} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-mediumGray/30 flex flex-col 
                         hover:border-primaryRed/60 hover:shadow-2xl hover:shadow-primaryRed/10 
                         transition-all duration-500 transform hover:-translate-y-2
                         relative"
            >
              {/* Image container with enhanced styling */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badge with enhanced styling */}
                {pkg.badge && (
                  <span className="absolute top-5 right-5 bg-primaryRed text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {pkg.badge}
                  </span>
                )}
              </div>
              
              {/* Content section with improved spacing */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-3 group-hover:text-primaryRed transition-colors duration-300">
                  {pkg.name}
                </h3>
                <p className="text-darkGray mb-6 flex-grow leading-relaxed text-base sm:text-lg">
                  {pkg.description}
                </p>
                
                {/* Price with enhanced styling */}
                <div className="mb-6 pb-6 border-b border-mediumGray/30">
                  <p className="font-bold text-2xl sm:text-3xl text-primaryRed">
                    {pkg.priceRange}
                  </p>
                  <p className="text-sm text-darkGray mt-1">Starting price</p>
                </div>
                
                {/* Inclusions list with better styling */}
                <ul className="space-y-3 mb-8">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start text-darkGray group/item">
                      <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primaryRed mr-3 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                      <span className="text-sm sm:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA button with enhanced styling */}
                <button
                  onClick={onBookNowClick}
                  className="mt-auto w-full bg-primaryRed text-white font-bold py-4 px-6 rounded-full 
                             hover:bg-opacity-90 hover:shadow-soft-red 
                             transition-all duration-300 transform hover:scale-105 active:scale-95
                             text-base sm:text-lg relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">Book This Package</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};