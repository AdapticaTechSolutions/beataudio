import React, { useState, useEffect } from 'react';
import type { Booking, PaymentRecord } from '../../types';
import { XIcon } from '../icons';
import { calculateDeadlines, formatDeadlineStatus } from '../../lib/utils/deadlines';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [booking.id]);

  const fetchPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await fetch(`${API_BASE_URL}/payments?bookingId=${booking.id}`);
      const data = await response.json();
      if (data.success) {
        // Map database fields to PaymentRecord format
        const mappedPayments = (data.data || []).map((p: any) => ({
          id: p.id,
          bookingId: p.booking_id,
          amount: parseFloat(p.amount),
          paymentType: p.payment_type,
          paymentMethod: p.payment_method,
          referenceNumber: p.reference_number,
          transactionId: p.transaction_id,
          paidAt: p.paid_at,
          paidBy: p.paid_by,
          validatedBy: p.validated_by,
          notes: p.notes,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        setPayments(mappedPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const eventDate = new Date(booking.eventDate + 'T00:00:00');
  const deadlines = calculateDeadlines(eventDate);
  const downpaymentStatus = formatDeadlineStatus(deadlines.downpaymentDeadline);
  const finalPaymentStatus = formatDeadlineStatus(deadlines.finalPaymentDeadline);

  const totalAmount = booking.totalAmount || 0;
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = totalAmount - totalPaid;
  const downpaymentAmount = totalAmount * 0.5;
  const finalPaymentAmount = totalAmount - downpaymentAmount;

  const downpaymentPaid = payments
    .filter(p => p.paymentType === 'downpayment' || p.paymentType === 'reservation')
    .reduce((sum, p) => sum + p.amount, 0);
  const downpaymentRemaining = Math.max(0, downpaymentAmount - downpaymentPaid);

  const statusColors: { [key in Booking['status']]: { bg: string; text: string; border: string } } = {
    Inquiry: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' },
    QuoteSent: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
    Confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
    Cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-mediumGray p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold text-black">Booking Details</h2>
            <p className="text-sm text-darkGray mt-1">Booking ID: {booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-darkGray hover:text-black transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[booking.status].bg} ${statusColors[booking.status].text}`}>
              {booking.status}
            </span>
            {booking.status === 'Confirmed' && (
              <span className="text-sm text-green-600 font-semibold">✓ Confirmed</span>
            )}
          </div>

          {/* Customer & Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-lightGray rounded-lg p-4">
              <h3 className="font-bold text-black mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-darkGray">Name</p>
                  <p className="font-semibold text-black">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-darkGray">Email</p>
                  <p className="font-semibold text-black">{booking.email}</p>
                </div>
                {booking.celNumber && (
                  <div>
                    <p className="text-darkGray">Phone</p>
                    <p className="font-semibold text-black">{booking.celNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-lightGray rounded-lg p-4">
              <h3 className="font-bold text-black mb-3">Event Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-darkGray">Event Date</p>
                  <p className="font-semibold text-black">
                    {eventDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-darkGray">Event Type</p>
                  <p className="font-semibold text-black">{booking.eventType}</p>
                </div>
                <div>
                  <p className="text-darkGray">Guest Count</p>
                  <p className="font-semibold text-black">{booking.guestCount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-darkGray">Venue</p>
                  <p className="font-semibold text-black">{booking.venueAddress || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-lightGray rounded-lg p-4">
            <h3 className="font-bold text-black mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {booking.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white rounded-md text-sm font-medium text-black border border-mediumGray"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-lightGray rounded-lg p-4">
            <h3 className="font-bold text-black mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-darkGray">Total Amount</p>
                  <p className="text-2xl font-bold text-black">₱{totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-darkGray">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</p>
                </div>
              </div>
              <div className="border-t border-mediumGray pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-black">Remaining Balance</p>
                  <p className={`text-2xl font-bold ${remainingBalance > 0 ? 'text-primaryRed' : 'text-green-600'}`}>
                    ₱{remainingBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Downpayment Deadline */}
            <div className={`border-2 rounded-lg p-4 ${
              downpaymentStatus.status === 'overdue' ? 'border-red-500 bg-red-50' :
              downpaymentStatus.status === 'due-soon' ? 'border-yellow-500 bg-yellow-50' :
              'border-mediumGray bg-lightGray'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-black">50% Downpayment</h4>
                  <p className="text-sm text-darkGray">Due 1 month before event</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  downpaymentStatus.status === 'overdue' ? 'bg-red-200 text-red-800' :
                  downpaymentStatus.status === 'due-soon' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {downpaymentStatus.label}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-darkGray">Amount Required</p>
                <p className="text-xl font-bold text-black">₱{downpaymentAmount.toLocaleString()}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-darkGray">Paid</p>
                <p className="text-lg font-semibold text-green-600">₱{downpaymentPaid.toLocaleString()}</p>
              </div>
              {downpaymentRemaining > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-darkGray">Remaining</p>
                  <p className="text-lg font-semibold text-primaryRed">₱{downpaymentRemaining.toLocaleString()}</p>
                </div>
              )}
              <p className="text-xs text-darkGray mt-2">
                Deadline: {deadlines.downpaymentDeadline.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            {/* Final Payment Deadline */}
            <div className={`border-2 rounded-lg p-4 ${
              finalPaymentStatus.status === 'overdue' ? 'border-red-500 bg-red-50' :
              finalPaymentStatus.status === 'due-soon' ? 'border-yellow-500 bg-yellow-50' :
              'border-mediumGray bg-lightGray'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-black">Remaining Balance</h4>
                  <p className="text-sm text-darkGray">Due on event day</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  finalPaymentStatus.status === 'overdue' ? 'bg-red-200 text-red-800' :
                  finalPaymentStatus.status === 'due-soon' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {finalPaymentStatus.label}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-darkGray">Amount Required</p>
                <p className="text-xl font-bold text-black">₱{finalPaymentAmount.toLocaleString()}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-darkGray">Paid</p>
                <p className="text-lg font-semibold text-green-600">
                  ₱{(totalPaid - downpaymentPaid).toLocaleString()}
                </p>
              </div>
              {remainingBalance > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-darkGray">Remaining</p>
                  <p className="text-lg font-semibold text-primaryRed">₱{remainingBalance.toLocaleString()}</p>
                </div>
              )}
              <p className="text-xs text-darkGray mt-2">
                Deadline: {deadlines.finalPaymentDeadline.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-lightGray rounded-lg p-4">
            <h3 className="font-bold text-black mb-4">Payment History</h3>
            {isLoadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryRed"></div>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-md p-3 border border-mediumGray">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-black">₱{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-darkGray">
                          {payment.paymentType} via {payment.paymentMethod}
                        </p>
                        {payment.referenceNumber && (
                          <p className="text-xs text-darkGray font-mono mt-1">
                            Ref: {payment.referenceNumber}
                          </p>
                        )}
                        {payment.validatedBy && (
                          <p className="text-xs text-darkGray mt-1">
                            Validated by: {payment.validatedBy}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-darkGray">
                          {new Date(payment.paidAt).toLocaleDateString()}
                        </p>
                        {payment.notes && (
                          <p className="text-xs text-darkGray mt-1 italic">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-darkGray text-center py-4 italic">No payments recorded yet</p>
            )}
          </div>

          {/* Additional Notes */}
          {booking.additionalNotes && (
            <div className="bg-lightGray rounded-lg p-4">
              <h3 className="font-bold text-black mb-2">Additional Notes</h3>
              <p className="text-sm text-darkGray whitespace-pre-wrap">{booking.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-mediumGray p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primaryRed text-white font-bold rounded-md hover:bg-opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

