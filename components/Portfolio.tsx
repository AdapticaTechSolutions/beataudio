import React from 'react';
import { PORTFOLIO_ITEMS } from '../constants';

export const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-20 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">Our Work in Action</h2>
          <p className="text-darkGray mt-2">See how we transform ordinary spaces into extraordinary experiences.</p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        <div className="columns-2 md:columns-3 gap-4">
          {PORTFOLIO_ITEMS.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-primaryRed text-sm">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};