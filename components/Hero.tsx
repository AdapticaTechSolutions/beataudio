import React from 'react';

interface HeroProps {
  onBookNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNowClick }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Enhanced background with actual photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/photos/Wedding/Tagaytay/Wedding 1/569190349_1398533622272571_6387164445008568536_n.jpg')" }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        {/* Subtle animated overlay for depth */}
        <div className="absolute inset-0 bg-primaryRed/10 animate-pulse"></div>
      </div>
      
      {/* Main content with improved spacing and typography */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Decorative element */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-1 bg-primaryRed"></div>
        </div>
        
        {/* Main heading with better hierarchy */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-6 text-white drop-shadow-2xl">
          Make Every Moment
          <span className="block text-primaryRed mt-2">Unforgettable</span>
        </h1>
        
        {/* Subtitle with improved readability */}
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed font-light">
          Premium audio, lighting, and special effects to transform your event into a cinematic experience.
        </p>
        
        {/* CTA buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
          <button
            onClick={onBookNowClick}
            className="group w-full sm:w-auto bg-primaryRed text-white font-bold py-4 px-10 rounded-full text-lg sm:text-xl hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="relative z-10">Book Your Event</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          <a
            href="#packages"
            className="w-full sm:w-auto border-2 border-white/90 text-white font-bold py-4 px-10 rounded-full text-lg sm:text-xl hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm bg-white/10"
          >
            View Packages
          </a>
        </div>
        
        {/* Trust indicator */}
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-white/70">
          <svg className="w-5 h-5 text-primaryRed" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Non-refundable ₱1,000 downpayment to reserve your date</span>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};