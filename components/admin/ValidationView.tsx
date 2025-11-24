
import React, { useState } from 'react';
import type { Booking } from '../../types';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface ValidationViewProps {
  bookings: Booking[];
  onValidate: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({ bookings, onValidate, onReject }) => {
  // Updated filter to use 'Inquiry' instead of 'Pending'
  const pendingBookings = bookings.filter(b => b.status === 'Inquiry');
  const [rejectionTarget, setRejectionTarget] = useState<Booking | null>(null);

  const handleConfirmReject = () => {
    if (rejectionTarget) {
      onReject(rejectionTarget.id);
      setRejectionTarget(null);
    }
  };

  const handleCancelReject = () => {
    setRejectionTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-serif font-bold text-black">Pending Validation</h1>
            <p className="text-darkGray mt-1">Review and validate bookings.</p>
        </div>
        <div className="flex items-center text-yellow-600 bg-yellow-100/80 rounded-full px-4 py-2">
            <span className="font-bold text-2xl">{pendingBookings.length}</span>
            <span className="ml-2 text-sm">pending</span>
        </div>
      </div>
      
      {pendingBookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-card overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-lightGray border-b border-mediumGray">
                <tr>
                  <th className="p-4 font-semibold text-black">Booking ID</th>
                  <th className="p-4 font-semibold text-black">Customer</th>
                  <th className="p-4 font-semibold text-black">Event Date</th>
                  <th className="p-4 font-semibold text-black">Services</th>
                  <th className="p-4 font-semibold text-black text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-mediumGray/50 last:border-b-0 hover:bg-lightGray/50">
                    <td className="p-4 text-darkGray font-mono text-sm">{booking.id}</td>
                    <td className="p-4 text-black font-medium">{booking.customerName}</td>
                    <td className="p-4 text-darkGray">{new Date(booking.eventDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="p-4 text-darkGray text-sm">{booking.services.join(', ')}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onValidate(booking.id)}
                          className="bg-green-600 text-white font-bold text-sm py-2 px-4 rounded-full hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                          Validate
                        </button>
                         <button 
                          onClick={() => setRejectionTarget(booking)}
                          className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-full hover:bg-red-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <XCircleIcon className="w-4 h-4 mr-1.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-16 text-center bg-white py-12 rounded-lg shadow-card border border-mediumGray/30">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-black">All Clear!</h3>
          <p className="text-darkGray mt-2">There are no bookings currently pending validation.</p>
        </div>
      )}

      {rejectionTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-6 text-center transform transition-all animate-scale-in">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-black mb-2">Confirm Rejection</h2>
            <p className="text-darkGray mb-4">
              Are you sure you want to reject the booking for <strong className="text-black">{rejectionTarget.customerName}</strong> (ID: {rejectionTarget.id})?
            </p>
            <p className="text-sm text-darkGray mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelReject}
                className="w-full bg-white border border-mediumGray text-black font-bold py-3 px-6 rounded-full hover:bg-lightGray transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors duration-300"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
