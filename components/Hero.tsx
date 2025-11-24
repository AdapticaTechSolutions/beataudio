import React, { useState } from 'react';

interface HeroProps {
  onBookNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNowClick }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/photos/Wedding/Tagaytay/Wedding 2/571154389_1395347699257830_3254642409205276693_n.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative z-10 p-4">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 text-shadow-lg">
          Make Every Moment Unforgettable.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/80">
          Premium audio, lighting, and special effects to transform your event into a cinematic experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookNowClick}
            className="w-full sm:w-auto bg-primaryRed text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105"
          >
            Inquire Now
          </button>
        </div>
        <p className="text-xs mt-4 text-white/60">
          Non-refundable ₱1,000 reservation fee to save your date.
        </p>
      </div>
    </section>
  );
};