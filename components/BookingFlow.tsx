import React from 'react';
import { ArrowRightIcon } from './icons';

interface BookingFlowProps {
  onBookNowClick: () => void;
}

const steps = ['Select Event', 'Choose Package', 'Choose Date', 'Down payment', 'For Confirmation'];

export const BookingFlow: React.FC<BookingFlowProps> = ({ onBookNowClick }) => {
  return (
    <section id="booking-flow" className="py-24 sm:py-28 bg-gradient-to-b from-white to-lightGray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Simple & Secure Booking
          </h2>
          <p className="text-lg sm:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed">
            Reserve your date in just a few minutes. Our streamlined process makes booking effortless.
          </p>
          <div className="mt-6 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved step flow with better visual design */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8 mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center p-4 sm:p-6 group">
                {/* Enhanced step number circle */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primaryRed to-primaryRed/80 border-4 border-white rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-soft-red">
                  {index + 1}
                  {/* Animated ring on hover */}
                  <div className="absolute inset-0 rounded-full border-4 border-primaryRed/30 animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                {/* Step label with better typography */}
                <h3 className="font-bold text-black text-base sm:text-lg md:text-xl group-hover:text-primaryRed transition-colors duration-300">
                  {step}
                </h3>
              </div>
              {/* Enhanced arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block text-primaryRed/40 mx-2 lg:mx-4 transform transition-transform duration-300 hover:scale-110">
                  <ArrowRightIcon className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Enhanced CTA button */}
        <div className="text-center mt-12 sm:mt-16">
          <button 
            onClick={onBookNowClick}
            className="bg-primaryRed text-white font-bold py-4 px-10 sm:px-12 rounded-full 
                       text-lg sm:text-xl hover:bg-opacity-90 hover:shadow-soft-red 
                       transition-all duration-300 transform hover:scale-105 active:scale-95
                       relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Start Booking Now</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          <p className="text-sm text-darkGray mt-4">
            Secure booking with ₱1,000 downpayment
          </p>
        </div>
      </div>
    </section>
  );
};