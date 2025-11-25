import React from 'react';
import { PACKAGES } from '../constants';
import { CheckCircleIcon } from './icons';

interface PackagesProps {
  onBookNowClick: () => void;
}

export const Packages: React.FC<PackagesProps> = ({ onBookNowClick }) => {
  return (
    <section id="packages" className="py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg">Curated Packages</h2>
          <p className="text-white/90 mt-2 drop-shadow-md">Choose the perfect set for your event, or customize your own.</p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} className="bg-white rounded-lg overflow-hidden shadow-card border border-mediumGray/50 flex flex-col hover:border-primaryRed/50 hover:shadow-soft-red transition-all duration-300">
              <div className="relative">
                <img src={pkg.image} alt={pkg.name} className="w-full h-56 object-cover" />
                {pkg.badge && (
                  <span className="absolute top-4 right-4 bg-primaryRed text-white text-xs font-bold px-3 py-1 rounded-full">{pkg.badge}</span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-black mb-2">{pkg.name}</h3>
                <p className="text-darkGray mb-4 flex-grow">{pkg.description}</p>
                <p className="font-semibold text-primaryRed mb-4">{pkg.priceRange}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-center text-darkGray">
                      <CheckCircleIcon className="w-5 h-5 text-primaryRed mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onBookNowClick}
                  className="mt-auto w-full bg-primaryRed text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105"
                >
                  Inquire This Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};