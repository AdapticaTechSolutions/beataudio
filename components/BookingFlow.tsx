import React from 'react';
import { ArrowRightIcon } from './icons';

interface BookingFlowProps {
  onBookNowClick: () => void;
}

const steps = ['Select Event', 'Choose Package', 'Choose Date', 'Downpayment', 'Confirmation'];

export const BookingFlow: React.FC<BookingFlowProps> = ({ onBookNowClick }) => {
  return (
    <section id="booking-flow" className="py-20 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">Simple & Secure Booking</h2>
          <p className="text-darkGray mt-2">Reserve your date in just a few minutes.</p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-white border-2 border-primaryRed rounded-full flex items-center justify-center text-primaryRed text-2xl font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-black">{step}</h3>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block text-primaryRed/50 mx-4">
                  <ArrowRightIcon className="w-8 h-8" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
         <div className="text-center mt-12">
            <button 
                onClick={onBookNowClick}
                className="bg-primaryRed text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105"
            >
                Start Booking Now
            </button>
        </div>
      </div>
    </section>
  );
};