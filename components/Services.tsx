import React from 'react';
import { SERVICES } from '../constants';

// Elegant dark color gradients for each service
const SERVICE_COLORS: Record<string, string> = {
  'Lighting': 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  'Sound Systems': 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900',
  'LED Walls': 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  'Trusses & Rigging': 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900',
  'Smoke & Effects': 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900',
  'Projectors': 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900',
};

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'Lighting': 'Dynamic lighting solutions that transform any space into a stunning visual experience',
  'Sound Systems': 'Crystal-clear audio systems for every event size and venue',
  'LED Walls': 'Stunning visual displays and backdrops that captivate your audience',
  'Trusses & Rigging': 'Professional rigging and structural support for safe equipment mounting',
  'Smoke & Effects': 'Atmospheric effects and special effects to create memorable moments',
  'Projectors': 'High-quality projection systems for presentations and displays',
};

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 sm:py-24 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-black mb-3 sm:mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed mb-6">
            Everything you need for a spectacular event. Professional equipment and expert setup for unforgettable experiences.
          </p>
          <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Large tile grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const bgColor = SERVICE_COLORS[service.name] || 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
            const description = SERVICE_DESCRIPTIONS[service.name] || 'Professional service for your event';
            
            return (
              <div
                key={service.name}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
                           transition-all duration-500 transform hover:-translate-y-2 cursor-pointer
                           border border-transparent hover:border-primaryRed/30"
              >
                {/* Elegant dark color background */}
                <div className={`relative h-64 sm:h-72 md:h-80 overflow-hidden ${bgColor}`}>
                  {/* Subtle pattern overlay for texture */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '40px 40px'
                    }}></div>
                  </div>
                  
                  {/* Service name overlay - perfectly centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center z-10">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 
                                 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500
                                 drop-shadow-lg">
                      {service.name}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base mb-4 opacity-0 group-hover:opacity-100 
                               transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100
                               max-w-xs mx-auto leading-relaxed">
                      {description}
                    </p>
                    {/* Accent line */}
                    <div className="w-16 h-1 bg-primaryRed transform scale-x-0 group-hover:scale-x-100 
                                  transition-transform duration-500 delay-200 origin-center"></div>
                  </div>
                  
                  {/* Elegant hover effect overlay */}
                  <div className="absolute inset-0 bg-primaryRed/0 group-hover:bg-primaryRed/5 
                                transition-all duration-500"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                {/* Bottom content card (slides up on hover) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md p-6 
                              transform translate-y-full group-hover:translate-y-0 transition-transform duration-500
                              border-t border-mediumGray/20">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-black mb-2">{service.name}</h4>
                    <p className="text-darkGray text-sm leading-relaxed mb-4">
                      {description}
                    </p>
                    <div className="flex items-center justify-center text-primaryRed font-semibold text-sm">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
