import React, { useState, useEffect } from 'react';
import type { PaymentRecord, Booking } from '../../types';
import { bookingsApi } from '../../lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface PaymentHistoryViewProps {
  bookings: Booking[];
  currentUser: { id: string; username: string; role: string };
}

export const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({ bookings, currentUser }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    bookingId: '',
    amount: '',
    paymentType: 'reservation' as 'reservation' | 'downpayment' | 'full' | 'partial',
    paymentMethod: 'cash',
    referenceNumber: '',
    transactionId: '',
    notes: '',
  });

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/payments`);
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
      setIsLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Only administrators can add payments');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: newPayment.bookingId,
          amount: parseFloat(newPayment.amount),
          paymentType: newPayment.paymentType,
          paymentMethod: newPayment.paymentMethod,
          referenceNumber: newPayment.referenceNumber,
          transactionId: newPayment.transactionId,
          notes: newPayment.notes,
          paidBy: currentUser.username,
          validatedBy: currentUser.username,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPayments();
        setShowAddPayment(false);
        setNewPayment({
          bookingId: '',
          amount: '',
          paymentType: 'reservation',
          paymentMethod: 'cash',
          referenceNumber: '',
          transactionId: '',
          notes: '',
        });
        alert('Payment recorded successfully');
      } else {
        alert(data.error || 'Failed to add payment');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const getBookingById = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  const getTotalPaid = (bookingId: string) => {
    return payments
      .filter(p => p.bookingId === bookingId)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const filteredPayments = selectedBooking
    ? payments.filter(p => p.bookingId === selectedBooking)
    : payments;

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryRed"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Payment History</h1>
          <p className="text-darkGray mt-1">Track all payments and transactions.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddPayment(true)}
            className="bg-primaryRed text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
          >
            + Add Payment
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <p className="text-sm text-darkGray mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primaryRed">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <p className="text-sm text-darkGray mb-1">Total Transactions</p>
          <p className="text-3xl font-bold text-black">{payments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <p className="text-sm text-darkGray mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-black">
            {new Set(payments.map(p => p.bookingId)).size}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6 border border-mediumGray">
        <label className="block text-sm font-bold text-black mb-2">Filter by Booking</label>
        <select
          value={selectedBooking || ''}
          onChange={(e) => setSelectedBooking(e.target.value || null)}
          className="w-full md:w-64 border border-mediumGray rounded-lg p-2"
        >
          <option value="">All Bookings</option>
          {bookings.map(booking => (
            <option key={booking.id} value={booking.id}>
              {booking.id} - {booking.customerName}
            </option>
          ))}
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden border border-mediumGray">
        <table className="w-full text-left">
          <thead className="bg-lightGray border-b border-mediumGray">
            <tr>
              <th className="p-4 font-semibold text-black text-sm">Date</th>
              <th className="p-4 font-semibold text-black text-sm">Booking ID</th>
              <th className="p-4 font-semibold text-black text-sm">Client</th>
              <th className="p-4 font-semibold text-black text-sm">Type</th>
              <th className="p-4 font-semibold text-black text-sm">Amount</th>
              <th className="p-4 font-semibold text-black text-sm">Method</th>
              <th className="p-4 font-semibold text-black text-sm">Reference #</th>
              <th className="p-4 font-semibold text-black text-sm">Transaction ID</th>
              <th className="p-4 font-semibold text-black text-sm">Validated By</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => {
                const booking = getBookingById(payment.bookingId);
                return (
                  <tr key={payment.id} className="border-b border-mediumGray/50 last:border-b-0">
                    <td className="p-4 text-sm text-darkGray">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono text-sm text-darkGray">{payment.bookingId}</td>
                    <td className="p-4 text-sm font-medium text-black">
                      {booking?.customerName || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        payment.paymentType === 'full' ? 'bg-green-100 text-green-800' :
                        payment.paymentType === 'downpayment' ? 'bg-blue-100 text-blue-800' :
                        payment.paymentType === 'reservation' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.paymentType}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-black">
                      ₱{payment.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-darkGray">{payment.paymentMethod}</td>
                    <td className="p-4 font-mono text-xs text-darkGray">
                      {payment.referenceNumber || '-'}
                    </td>
                    <td className="p-4 font-mono text-xs text-darkGray">
                      {payment.transactionId || '-'}
                    </td>
                    <td className="p-4 text-sm text-darkGray">{payment.validatedBy || payment.paidBy || '-'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-darkGray italic">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Add Payment</h2>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Booking ID *</label>
                <select
                  value={newPayment.bookingId}
                  onChange={(e) => setNewPayment({ ...newPayment, bookingId: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  required
                >
                  <option value="">Select Booking</option>
                  {bookings.map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.id} - {booking.customerName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Amount (₱) *</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Payment Type *</label>
                <select
                  value={newPayment.paymentType}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value as any })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  required
                >
                  <option value="reservation">Reservation Fee</option>
                  <option value="downpayment">Downpayment</option>
                  <option value="partial">Partial Payment</option>
                  <option value="full">Full Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Payment Method *</label>
                <select
                  value={newPayment.paymentMethod}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="gcash">GCash</option>
                  <option value="paymaya">PayMaya</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Reference Number</label>
                <input
                  type="text"
                  value={newPayment.referenceNumber}
                  onChange={(e) => setNewPayment({ ...newPayment, referenceNumber: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  placeholder="Reference number from payment screenshot"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={newPayment.transactionId}
                  onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  placeholder="Optional - Transaction ID from payment gateway"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Notes</label>
                <textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="w-full border border-mediumGray rounded-lg p-2"
                  rows={3}
                  placeholder="Optional notes"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 px-4 py-2 border border-mediumGray rounded-lg font-semibold text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primaryRed text-white rounded-lg font-bold hover:bg-opacity-90"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

