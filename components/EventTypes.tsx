import React from 'react';
import { EVENT_TYPES } from '../constants';

export const EventTypes: React.FC = () => {
  return (
    <section id="events" className="py-20 sm:py-24 bg-gradient-to-b from-lightGray to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header */}
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Perfect for Any Occasion
          </h3>
          <p className="text-lg text-darkGray max-w-2xl mx-auto">
            From intimate celebrations to grand events, we bring the magic to every moment.
          </p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved horizontal scroll with better cards */}
        <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide snap-x snap-mandatory">
          {EVENT_TYPES.map((event, index) => (
            <div 
              key={event.name} 
              className="flex-shrink-0 group relative cursor-pointer snap-start
                         w-64 sm:w-80 md:w-96 rounded-xl overflow-hidden
                         transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image with better loading and hover effects */}
              <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-110" 
                  loading="lazy"
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl mb-1 drop-shadow-lg transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {event.name}
                  </span>
                  <div className="w-12 h-0.5 bg-primaryRed transform group-hover:scale-x-100 scale-x-0 transition-transform duration-300 origin-left"></div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-primaryRed/0 group-hover:bg-primaryRed/10 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Scroll hint for mobile */}
        <div className="text-center mt-6 text-darkGray text-sm md:hidden">
          <span>← Swipe to see more →</span>
        </div>
      </div>
    </section>
  );
};