import React, { useState } from 'react';
import type { Booking } from '../../types';
import { MailIcon, CheckCircleIcon, ArrowRightIcon, FileEditIcon } from '../icons';
import { PaymentValidationModal } from './PaymentValidationModal';

interface InquiriesViewProps {
  bookings: Booking[];
  onValidatePayment: (bookingId: string, paymentData: {
    referenceNumber: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }) => Promise<void>;
  currentUser?: { id: string; username: string; role: string };
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({ 
  bookings, 
  onValidatePayment,
  currentUser 
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const inquiries = bookings.filter(b => b.status === 'Inquiry');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-serif font-bold text-black">Payment Validation</h1>
            <p className="text-darkGray mt-1">Validate payments from Messenger screenshots and cross-match with reference numbers.</p>
        </div>
      </div>
      
      {/* NEW INQUIRIES SECTION */}
      <h2 className="text-xl font-bold text-black mb-4 flex items-center">
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">{inquiries.length} Pending</span>
          Pending Payment Validation
      </h2>
      
      {inquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {inquiries.map(inquiry => (
                <div key={inquiry.id} className="bg-white rounded-lg shadow-card border border-mediumGray p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-mono text-darkGray bg-lightGray px-2 py-1 rounded">{inquiry.id}</span>
                            <h3 className="font-bold text-lg text-black mt-2">{inquiry.eventType}</h3>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-primaryRed">{new Date(inquiry.eventDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                             <p className="text-xs text-darkGray">{new Date(inquiry.eventDate).getFullYear()}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-darkGray mb-6 flex-grow">
                        <p><strong className="text-black">Client:</strong> {inquiry.customerName}</p>
                        <p><strong className="text-black">Venue:</strong> {inquiry.venue} {inquiry.ceremonyVenue ? `(+ ${inquiry.ceremonyVenue})` : ''}</p>
                        <p><strong className="text-black">Pax:</strong> {inquiry.guestCount}</p>
                        <p><strong className="text-black">Services:</strong> {inquiry.services.join(', ')}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                            <p className="text-xs text-yellow-800">
                                <strong>Note:</strong> Customer should send payment screenshot via Messenger with reference number.
                            </p>
                        </div>
                        <button 
                            onClick={() => setSelectedBooking(inquiry)}
                            className="w-full bg-primaryRed text-white font-bold py-2 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center text-sm"
                        >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Validate Payment
                        </button>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <p className="text-darkGray italic mb-12">No pending payment validations.</p>
      )}

      {/* Payment Validation Modal */}
      {selectedBooking && (
        <PaymentValidationModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onValidate={async (bookingId, paymentData) => {
            await onValidatePayment(bookingId, paymentData);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};