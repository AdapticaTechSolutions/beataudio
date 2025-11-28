import React, { useState, useEffect } from 'react';
import type { Booking, PaymentRecord } from '../../types';
import { XIcon } from '../icons';
import { calculateDeadlines, formatDeadlineStatus } from '../../lib/utils/deadlines';
import { ConfirmationDialog } from './ConfirmationDialog';
import { bookingsApi } from '../../lib/api';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onNavigateToPayments?: () => void;
  onBookingUpdate?: (booking: Booking) => void;
  onPaymentRemoved?: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onNavigateToPayments,
  onBookingUpdate,
  onPaymentRemoved,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRemovePaymentConfirm, setShowRemovePaymentConfirm] = useState(false);
  const [selectedPaymentToRemove, setSelectedPaymentToRemove] = useState<PaymentRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentType: 'partial' as 'reservation' | 'downpayment' | 'full' | 'partial',
    paymentMethod: 'gcash',
    referenceNumber: '',
    transactionId: '',
    notes: '',
    paidBy: '',
  });

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
  const isFullyPaid = totalPaid >= totalAmount && totalAmount > 0;
  const downpaymentAmount = totalAmount * 0.5;
  const finalPaymentAmount = totalAmount - downpaymentAmount;

  const downpaymentPaid = payments
    .filter(p => p.paymentType === 'downpayment' || p.paymentType === 'reservation')
    .reduce((sum, p) => sum + p.amount, 0);
  const downpaymentRemaining = Math.max(0, downpaymentAmount - downpaymentPaid);

  // Get current user for validatedBy field
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('admin_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || 'admin';
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    return 'admin';
  };

  const handleAddPayment = async () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: parseFloat(paymentForm.amount),
          paymentType: paymentForm.paymentType,
          paymentMethod: paymentForm.paymentMethod,
          referenceNumber: paymentForm.referenceNumber || undefined,
          transactionId: paymentForm.transactionId || undefined,
          notes: paymentForm.notes || undefined,
          paidBy: paymentForm.paidBy || booking.customerName,
          validatedBy: getCurrentUser(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh payments
        await fetchPayments();
        // Update booking if needed
        if (onBookingUpdate) {
          const updatedBooking = { ...booking };
          if (!updatedBooking.totalAmount) {
            updatedBooking.totalAmount = totalAmount || parseFloat(paymentForm.amount);
          }
          onBookingUpdate(updatedBooking);
        }
        // Reset form and close modal
        setPaymentForm({
          amount: '',
          paymentType: 'partial',
          paymentMethod: 'gcash',
          referenceNumber: '',
          transactionId: '',
          notes: '',
          paidBy: '',
        });
        setShowAddPaymentModal(false);
        alert('Payment added successfully!');
      } else {
        throw new Error(data.error || 'Failed to add payment');
      }
    } catch (error: any) {
      console.error('Error adding payment:', error);
      alert(`Error adding payment: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsProcessing(true);
    try {
      const response = await bookingsApi.update(booking.id, {
        status: 'Cancelled',
      });

      if (response.success && response.data) {
        if (onBookingUpdate) {
          onBookingUpdate(response.data);
        }
        setShowCancelConfirm(false);
        alert('Booking cancelled successfully');
      } else {
        throw new Error(response.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      alert(`Error cancelling booking: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePayment = async () => {
    if (!selectedPaymentToRemove) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${selectedPaymentToRemove.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        // Refresh payments
        await fetchPayments();
        if (onPaymentRemoved) {
          onPaymentRemoved();
        }
        setShowRemovePaymentConfirm(false);
        setSelectedPaymentToRemove(null);
        alert('Payment removed successfully');
      } else {
        throw new Error(data.error || 'Failed to remove payment');
      }
    } catch (error: any) {
      console.error('Error removing payment:', error);
      alert(`Error removing payment: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCalendarUrl = (type: 'google' | 'mac') => {
    const eventDate = new Date(booking.eventDate + 'T00:00:00');
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(`${booking.eventType} - ${booking.customerName}`);
    const details = encodeURIComponent(
      `Event Type: ${booking.eventType}\n` +
      `Customer: ${booking.customerName}\n` +
      `Email: ${booking.email}\n` +
      `Phone: ${booking.celNumber || booking.contactNumber || 'N/A'}\n` +
      `Venue: ${booking.venueAddress || booking.venue || 'N/A'}\n` +
      `Guest Count: ${booking.guestCount || 'N/A'}\n` +
      `Services: ${booking.services.join(', ')}\n` +
      `Total Amount: ₱${totalAmount.toLocaleString()}\n` +
      `Status: ${booking.status}`
    );
    const location = encodeURIComponent(booking.venueAddress || booking.venue || '');

    if (type === 'google') {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    } else {
      // Mac Calendar (iCal format)
      const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Beat Audio//Booking//EN',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${details.replace(/%0A/g, '\\n')}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      
      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      return url;
    }
  };

  const handleAddToCalendar = (type: 'google' | 'mac') => {
    if (type === 'google') {
      window.open(generateCalendarUrl('google'), '_blank');
    } else {
      const url = generateCalendarUrl('mac');
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-${booking.id}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

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

          {/* Payment Status - Show Fully Paid if applicable */}
          {isFullyPaid ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-green-800 mb-2">✓ Fully Paid</h4>
                  <p className="text-green-700">
                    Total Amount: ₱{totalAmount.toLocaleString()} | 
                    Total Paid: ₱{totalPaid.toLocaleString()}
                  </p>
                  {totalPaid > totalAmount && (
                    <p className="text-sm text-green-600 mt-2">
                      Overpayment: ₱{(totalPaid - totalAmount).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </div>
          ) : (
            <>
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
                      <div className="flex-1">
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
                      <div className="text-right flex items-start gap-2">
                        <div>
                          <p className="text-sm text-darkGray">
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-darkGray mt-1 italic">{payment.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPaymentToRemove(payment);
                            setShowRemovePaymentConfirm(true);
                          }}
                          disabled={isProcessing}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Remove payment"
                        >
                          ×
                        </button>
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
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-mediumGray p-4 flex flex-wrap gap-3">
          {/* Calendar Integration */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCalendar('google')}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors text-sm"
              title="Add to Google Calendar"
            >
              📅 Google
            </button>
            <button
              onClick={() => handleAddToCalendar('mac')}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-800 transition-colors text-sm"
              title="Add to Mac Calendar"
            >
              📅 Mac
            </button>
          </div>

          {/* Add Payment Button */}
          {booking.status !== 'Cancelled' && (
            <button
              onClick={() => setShowAddPaymentModal(true)}
              disabled={isProcessing}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              + Add Payment
            </button>
          )}

          {booking.status !== 'Cancelled' && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={isProcessing}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Cancel Booking
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-lightGray text-black font-bold rounded-md hover:bg-mediumGray transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {showCancelConfirm && (
        <ConfirmationDialog
          title="Cancel Booking"
          message={`Are you sure you want to cancel booking ${booking.id}? This action will mark the booking as cancelled.`}
          confirmText="Yes, Cancel Booking"
          cancelText="No, Keep Booking"
          confirmColor="red"
          isDestructive={true}
          onConfirm={handleCancelBooking}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}

      {showRemovePaymentConfirm && selectedPaymentToRemove && (
        <ConfirmationDialog
          title="Remove Payment"
          message={`Are you sure you want to remove payment of ₱${selectedPaymentToRemove.amount.toLocaleString()} (Ref: ${selectedPaymentToRemove.referenceNumber || 'N/A'})? This action cannot be undone.`}
          confirmText="Yes, Remove Payment"
          cancelText="Cancel"
          confirmColor="red"
          isDestructive={true}
          onConfirm={handleRemovePayment}
          onCancel={() => {
            setShowRemovePaymentConfirm(false);
            setSelectedPaymentToRemove(null);
          }}
        />
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-card max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Add Payment</h3>
                <button
                  onClick={() => {
                    setShowAddPaymentModal(false);
                    setPaymentForm({
                      amount: '',
                      paymentType: 'partial',
                      paymentMethod: 'gcash',
                      referenceNumber: '',
                      transactionId: '',
                      notes: '',
                      paidBy: '',
                    });
                  }}
                  className="text-darkGray hover:text-black transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Amount (₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Payment Type *
                  </label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                  >
                    <option value="reservation">Reservation</option>
                    <option value="downpayment">Downpayment</option>
                    <option value="partial">Partial Payment</option>
                    <option value="full">Full Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                  >
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={paymentForm.referenceNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                    placeholder="Enter reference number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Paid By
                  </label>
                  <input
                    type="text"
                    value={paymentForm.paidBy}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paidBy: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                    placeholder={booking.customerName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Notes
                  </label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-mediumGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowAddPaymentModal(false);
                    setPaymentForm({
                      amount: '',
                      paymentType: 'partial',
                      paymentMethod: 'gcash',
                      referenceNumber: '',
                      transactionId: '',
                      notes: '',
                      paidBy: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-lightGray text-black font-bold rounded-md hover:bg-mediumGray transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={isProcessing || !paymentForm.amount}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Adding...' : 'Add Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

