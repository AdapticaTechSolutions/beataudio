import React, { useState } from 'react';
import type { Booking } from '../../types';
import { XIcon } from '../icons';

interface PaymentValidationModalProps {
  booking: Booking;
  onClose: () => void;
  onValidate: (bookingId: string, paymentData: {
    referenceNumber: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }) => Promise<void>;
}

export const PaymentValidationModal: React.FC<PaymentValidationModalProps> = ({
  booking,
  onClose,
  onValidate,
}) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [notes, setNotes] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    setError('');
    
    // Validation
    if (!referenceNumber.trim()) {
      setError('Reference number is required');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setIsValidating(true);
    try {
      await onValidate(booking.id, {
        referenceNumber: referenceNumber.trim(),
        amount: parseFloat(amount),
        paymentMethod,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to validate payment');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-mediumGray p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-black">Validate Payment</h2>
            <p className="text-sm text-darkGray mt-1">Cross-match payment details with reference number</p>
          </div>
          <button
            onClick={onClose}
            className="text-darkGray hover:text-black transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Booking Details */}
        <div className="p-6 border-b border-mediumGray bg-lightGray">
          <h3 className="font-bold text-black mb-3">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-darkGray">Booking ID</p>
              <p className="font-mono font-bold text-black">{booking.id}</p>
            </div>
            <div>
              <p className="text-darkGray">Customer</p>
              <p className="font-bold text-black">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-darkGray">Event Date</p>
              <p className="font-bold text-black">{new Date(booking.eventDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-darkGray">Event Type</p>
              <p className="font-bold text-black">{booking.eventType}</p>
            </div>
            {booking.totalAmount && (
              <div>
                <p className="text-darkGray">Expected Amount</p>
                <p className="font-bold text-primaryRed">₱{booking.totalAmount.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Validation Form */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Payment Reference Number <span className="text-primaryRed">*</span>
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number from payment screenshot"
              className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"
            />
            <p className="text-xs text-darkGray mt-1">
              Cross-match this with the reference number from the payment screenshot sent via Messenger
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Payment Amount <span className="text-primaryRed">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-darkGray">₱</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-lightGray border border-mediumGray rounded-md p-3 pl-8 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Payment Method <span className="text-primaryRed">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"
              >
                <option value="gcash">GCash</option>
                <option value="maya">Maya</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the payment..."
              rows={3}
              className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-mediumGray">
            <button
              onClick={onClose}
              disabled={isValidating}
              className="flex-1 bg-lightGray text-black font-bold py-3 px-6 rounded-md hover:bg-mediumGray transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex-1 bg-primaryRed text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                'Validate & Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

