import React from 'react';
import { EVENT_TYPES } from '../constants';

export const EventTypes: React.FC = () => {
  return (
    <section id="events" className="py-12 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-2xl font-serif text-black mb-8">Perfect for Any Occasion</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {EVENT_TYPES.map((event) => (
            <div key={event.name} className="flex-shrink-0 group relative cursor-pointer">
              <img src={event.image} alt={event.name} className="w-48 h-28 md:w-64 md:h-40 object-cover rounded-lg brightness-75 group-hover:brightness-100 transition-all duration-300" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
              <span className="absolute bottom-3 left-3 text-white font-semibold text-lg">{event.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};