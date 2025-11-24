import React from 'react';

export const DownpaymentInfo: React.FC = () => {
  return (
    <section id="downpayment" className="py-20 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 border border-primaryRed/30 flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
          {/* Left: Red Button with Amount */}
          <div className="flex-shrink-0">
            <div className="bg-primaryRed rounded-lg px-8 py-10 md:px-12 md:py-14 text-center shadow-md">
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">₱1,000</div>
              <div className="text-lg md:text-xl text-white/90">Downpayment</div>
            </div>
          </div>
          
          {/* Right: Content */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">Secure Your Date Instantly</h2>
            <p className="text-darkGray mb-6 leading-relaxed">
              A non-refundable ₱1,000 downpayment is all it takes to reserve our equipment and team for your event date. This amount will be deducted from your final bill.
            </p>
            <ul className="text-darkGray space-y-3">
              <li className="flex items-start">
                <span className="text-primaryRed mr-3 mt-1 font-bold text-lg">✓</span>
                <span>
                  <strong className="text-black">Secure Payments:</strong> We support GCash, PayMaya, Bank Transfer, and Credit/Debit Cards via our secure payment gateway.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primaryRed mr-3 mt-1 font-bold text-lg">✓</span>
                <span>
                  <strong className="text-black">Instant Confirmation:</strong> Receive immediate booking confirmation upon payment.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primaryRed mr-3 mt-1 font-bold text-lg">✓</span>
                <span>
                  <strong className="text-black">Flexible Options:</strong> Multiple payment methods available for your convenience.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};