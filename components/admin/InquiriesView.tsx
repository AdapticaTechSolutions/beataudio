import React, { useState } from 'react';
import type { Booking } from '../../types';
import { MailIcon, CheckCircleIcon, ArrowRightIcon } from '../icons';

interface InquiriesViewProps {
  bookings: Booking[];
  onGenerateQuote: (bookingId: string) => void;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({ bookings, onGenerateQuote }) => {
  const inquiries = bookings.filter(b => b.status === 'Inquiry');
  const quotesSent = bookings.filter(b => b.status === 'QuoteSent');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-serif font-bold text-black">Client Inquiries</h1>
            <p className="text-darkGray mt-1">Review details and send quotation links.</p>
        </div>
      </div>
      
      {/* NEW INQUIRIES SECTION */}
      <h2 className="text-xl font-bold text-black mb-4 flex items-center">
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">{inquiries.length} New</span>
          New Requests
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
                    
                    <button 
                        onClick={() => onGenerateQuote(inquiry.id)}
                        className="w-full bg-black text-white font-bold py-2 rounded hover:bg-primaryRed transition-colors flex items-center justify-center text-sm"
                    >
                        Review & Send Quote Link
                    </button>
                </div>
            ))}
        </div>
      ) : (
        <p className="text-darkGray italic mb-12">No new inquiries.</p>
      )}

      {/* PENDING PAYMENT (QUOTE SENT) SECTION */}
      <h2 className="text-xl font-bold text-black mb-4 flex items-center">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">{quotesSent.length} Pending</span>
          Waiting for Downpayment
      </h2>
      
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
         <table className="w-full text-left">
              <thead className="bg-lightGray border-b border-mediumGray">
                <tr>
                  <th className="p-4 font-semibold text-black text-sm">ID</th>
                  <th className="p-4 font-semibold text-black text-sm">Customer</th>
                  <th className="p-4 font-semibold text-black text-sm">Event Date</th>
                  <th className="p-4 font-semibold text-black text-sm">Quote Amount</th>
                  <th className="p-4 font-semibold text-black text-sm">Link Status</th>
                </tr>
              </thead>
              <tbody>
                  {quotesSent.map(q => (
                      <tr key={q.id} className="border-b border-mediumGray/50 last:border-b-0 text-sm">
                          <td className="p-4 font-mono text-darkGray">{q.id}</td>
                          <td className="p-4 font-medium text-black">{q.customerName}</td>
                          <td className="p-4 text-darkGray">{q.eventDate}</td>
                          <td className="p-4 font-bold text-black">₱{(q.totalAmount || 0).toLocaleString()}</td>
                          <td className="p-4">
                              <span className="inline-flex items-center text-green-700 bg-green-100 px-2 py-1 rounded text-xs">
                                  <MailIcon className="w-3 h-3 mr-1" /> Link Sent
                              </span>
                          </td>
                      </tr>
                  ))}
                  {quotesSent.length === 0 && (
                      <tr><td colSpan={5} className="p-4 text-center text-darkGray italic">No quotes pending payment.</td></tr>
                  )}
              </tbody>
         </table>
      </div>
    </div>
  );
};