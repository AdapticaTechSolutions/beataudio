import React from 'react';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg">Our Services</h2>
          <p className="text-white/90 mt-2 drop-shadow-md">Everything you need for a spectacular event.</p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.name}
              className="group bg-lightGray p-6 rounded-lg text-center flex flex-col items-center justify-center aspect-square
                         border border-transparent hover:border-primaryRed/50 hover:shadow-card
                         transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <service.icon className="w-10 h-10 md:w-12 md:h-12 text-primaryRed mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-md md:text-lg font-semibold text-black">{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};