import React from 'react';
import { CheckCircleIcon } from './icons';

export const DownpaymentInfo: React.FC = () => {
  return (
    <section id="downpayment" className="py-24 sm:py-28 bg-lightGray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Enhanced card with better visual design */}
        <div className="bg-gradient-to-br from-white to-lightGray rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16 border-2 border-primaryRed/30 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primaryRed/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primaryRed/5 rounded-full blur-3xl"></div>
          
          {/* Price display with enhanced styling */}
          <div className="text-center md:text-left flex-shrink-0 relative z-10">
            <div className="inline-block bg-gradient-to-br from-primaryRed to-primaryRed/80 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-2">
                ₱1,000
              </div>
              <div className="text-base sm:text-lg text-white/90 font-semibold">Downpayment</div>
            </div>
          </div>
          
          {/* Content section with improved layout */}
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-black mb-4 sm:mb-6">
              Secure Your Date Instantly
            </h2>
            <p className="text-base sm:text-lg text-darkGray mb-6 leading-relaxed">
              A non-refundable ₱1,000 downpayment is all it takes to reserve our equipment and team for your event date. This amount will be deducted from your final bill.
            </p>
            
            {/* Enhanced features list */}
            <ul className="space-y-4">
              <li className="flex items-start group/item">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="w-6 h-6 text-primaryRed group-hover/item:scale-110 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                  <span className="text-darkGray">
                    <strong className="text-black font-semibold">Secure Payments:</strong> We support GCash, PayMaya, Bank Transfer, and Credit/Debit Cards via our secure payment gateway.
                  </span>
                </div>
              </li>
              <li className="flex items-start group/item">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="w-6 h-6 text-primaryRed group-hover/item:scale-110 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                  <span className="text-darkGray">
                    <strong className="text-black font-semibold">Instant Confirmation:</strong> Receive immediate booking confirmation upon payment.
                  </span>
                </div>
              </li>
              <li className="flex items-start group/item">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="w-6 h-6 text-primaryRed group-hover/item:scale-110 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                  <span className="text-darkGray">
                    <strong className="text-black font-semibold">Flexible Options:</strong> Multiple payment methods available for your convenience.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};