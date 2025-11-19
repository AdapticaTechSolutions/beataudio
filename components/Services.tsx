import React from 'react';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header section */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed">
            Everything you need for a spectacular event. Professional equipment and expert setup for unforgettable experiences.
          </p>
          <div className="mt-6 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved grid layout with better spacing */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.name}
              className="group bg-gradient-to-br from-lightGray to-white p-6 sm:p-8 rounded-xl text-center flex flex-col items-center justify-center aspect-square
                         border-2 border-mediumGray/30 hover:border-primaryRed/60 hover:shadow-lg hover:shadow-primaryRed/10
                         transition-all duration-300 transform hover:-translate-y-3 cursor-pointer
                         relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Decorative background element */}
              <div className="absolute inset-0 bg-gradient-to-br from-primaryRed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon with enhanced styling */}
              <div className="relative z-10 mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 rounded-full bg-primaryRed/10 group-hover:bg-primaryRed/20 transition-colors duration-300">
                  <service.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primaryRed transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                </div>
              </div>
              
              {/* Service name with better typography */}
              <h3 className="relative z-10 text-sm sm:text-base md:text-lg font-semibold text-black group-hover:text-primaryRed transition-colors duration-300">
                {service.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};