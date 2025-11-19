import React from 'react';
import { PORTFOLIO_ITEMS } from '../constants';

export const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-24 sm:py-28 bg-gradient-to-b from-white to-lightGray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Our Work in Action
          </h2>
          <p className="text-lg sm:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed">
            See how we transform ordinary spaces into extraordinary experiences. Every event tells a story.
          </p>
          <div className="mt-6 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved masonry layout with better spacing and effects */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <div 
              key={item.id} 
              className="mb-4 sm:mb-6 break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer
                         transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primaryRed/20
                         bg-white"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image container */}
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                
                {/* Enhanced overlay with better gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-primaryRed text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 drop-shadow-lg">
                      {item.title}
                    </h3>
                    <div className="w-12 h-0.5 bg-primaryRed mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </div>
                
                {/* Subtle border on hover */}
                <div className="absolute inset-0 border-2 border-primaryRed/0 group-hover:border-primaryRed/50 rounded-xl transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Optional: View more CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-darkGray text-sm sm:text-base mb-4">
            Want to see more? Contact us for a full portfolio presentation.
          </p>
          <a 
            href="#contact" 
            className="inline-block text-primaryRed font-semibold hover:underline transition-all duration-300"
          >
            Get in Touch →
          </a>
        </div>
      </div>
    </section>
  );
};