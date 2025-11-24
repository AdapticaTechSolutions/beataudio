import React from 'react';

export const DownpaymentInfo: React.FC = () => {
  return (
    <section id="downpayment" className="py-20 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-card p-8 md:p-12 border border-primaryRed/20 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left flex-shrink-0">
            <div className="text-5xl md:text-7xl font-bold text-primaryRed">₱1,000</div>
            <div className="text-lg text-darkGray mt-1">Downpayment</div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">Secure Your Date Instantly</h2>
            <p className="text-darkGray mb-4">
              A non-refundable ₱1,000 downpayment is all it takes to reserve our equipment and team for your event date. This amount will be deducted from your final bill.
            </p>
            <ul className="text-darkGray space-y-2">
              <li className="flex items-start">
                <span className="text-primaryRed mr-2 mt-1">✓</span>
                <span><strong className="text-black">Secure Payments:</strong> We support GCash, PayMaya, Bank Transfer, and Credit/Debit Cards via our secure payment gateway.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};