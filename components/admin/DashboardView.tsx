import React, { useState, useEffect } from 'react';
import type { Booking, PaymentRecord } from '../../types';
import { DashboardIcon, DollarIcon, ShoppingBagIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '../icons';
import { calculateDeadlines, formatDeadlineStatus } from '../../lib/utils/deadlines';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

interface DashboardViewProps {
  bookings: Booking[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ bookings }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/payments`);
      const data = await response.json();
      if (data.success) {
        const mappedPayments = (data.data || []).map((p: any) => ({
          id: p.id,
          bookingId: p.bookingId || p.booking_id,
          amount: typeof p.amount === 'number' ? p.amount : parseFloat(p.amount || 0),
          paymentType: p.paymentType || p.payment_type,
          paymentMethod: p.paymentMethod || p.payment_method,
          referenceNumber: p.referenceNumber || p.reference_number,
          transactionId: p.transactionId || p.transaction_id,
          paidAt: p.paidAt || p.paid_at,
          paidBy: p.paidBy || p.paid_by,
          validatedBy: p.validatedBy || p.validated_by,
          notes: p.notes,
          createdAt: p.createdAt || p.created_at,
          updatedAt: p.updatedAt || p.updated_at,
        }));
        setPayments(mappedPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  
  const pendingInquiries = bookings.filter(b => b.status === 'Inquiry').length;
  const pendingQuotes = bookings.filter(b => b.status === 'QuoteSent').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  
  // Upcoming events (next 30 days)
  const today = new Date();
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingEvents = bookings
    .filter(b => {
      if (b.status === 'Cancelled') return false;
      const eventDate = new Date(b.eventDate + 'T00:00:00');
      return eventDate >= today && eventDate <= nextMonth;
    })
    .sort((a, b) => {
      const dateA = new Date(a.eventDate + 'T00:00:00').getTime();
      const dateB = new Date(b.eventDate + 'T00:00:00').getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  // Recent payments (last 10)
  const recentPayments = payments
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 10);

  // Calculate pending revenue (bookings with remaining balance)
  const pendingRevenue = bookings
    .filter(b => b.status !== 'Cancelled' && b.totalAmount)
    .reduce((sum, booking) => {
      const bookingPayments = payments.filter(p => p.bookingId === booking.id);
      const totalPaid = bookingPayments.reduce((s, p) => s + p.amount, 0);
      const remaining = (booking.totalAmount || 0) - totalPaid;
      return sum + Math.max(0, remaining);
    }, 0);

  // Calculate monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.paidAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Bookings with overdue payments
  const overdueBookings = bookings
    .filter(b => b.status === 'Confirmed' && b.totalAmount)
    .filter(booking => {
      const eventDate = new Date(booking.eventDate + 'T00:00:00');
      const deadlines = calculateDeadlines(eventDate);
      const bookingPayments = payments.filter(p => p.bookingId === booking.id);
      const totalPaid = bookingPayments.reduce((s, p) => s + p.amount, 0);
      const downpaymentPaid = bookingPayments
        .filter(p => p.paymentType === 'downpayment' || p.paymentType === 'reservation')
        .reduce((s, p) => s + p.amount, 0);
      const downpaymentAmount = (booking.totalAmount || 0) * 0.5;
      
      const downpaymentStatus = formatDeadlineStatus(deadlines.downpaymentDeadline);
      const finalPaymentStatus = formatDeadlineStatus(deadlines.finalPaymentDeadline);
      
      return (
        (downpaymentStatus.status === 'overdue' && downpaymentPaid < downpaymentAmount) ||
        (finalPaymentStatus.status === 'overdue' && totalPaid < (booking.totalAmount || 0))
      );
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryRed mx-auto mb-4"></div>
          <p className="text-darkGray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <DashboardIcon className="w-8 h-8 text-primaryRed" />
        <h1 className="text-3xl font-serif font-bold text-black">Dashboard</h1>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarIcon className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-sm text-green-700 font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-800">₱{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">This Month: ₱{monthlyRevenue.toLocaleString()}</p>
        </div>

        {/* Pending Revenue */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded">Pending</span>
          </div>
          <p className="text-sm text-yellow-700 font-medium mb-1">Pending Revenue</p>
          <p className="text-3xl font-bold text-yellow-800">₱{pendingRevenue.toLocaleString()}</p>
          <p className="text-xs text-yellow-600 mt-2">{overdueBookings.length} overdue payment(s)</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-sm text-blue-700 font-medium mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-blue-800">{pendingInquiries + pendingQuotes}</p>
          <p className="text-xs text-blue-600 mt-2">
            {pendingInquiries} Inquiries, {pendingQuotes} Quotes Sent
          </p>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded">Confirmed</span>
          </div>
          <p className="text-sm text-purple-700 font-medium mb-1">Confirmed Bookings</p>
          <p className="text-3xl font-bold text-purple-800">{confirmedBookings}</p>
          <p className="text-xs text-purple-600 mt-2">{upcomingEvents.length} upcoming in next 30 days</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-6 h-6 text-primaryRed" />
            <h2 className="text-xl font-bold text-black">Upcoming Events</h2>
            <span className="ml-auto text-sm text-darkGray">Next 30 Days</span>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((booking) => {
                const eventDate = new Date(booking.eventDate + 'T00:00:00');
                const bookingPayments = payments.filter(p => p.bookingId === booking.id);
                const totalPaid = bookingPayments.reduce((s, p) => s + p.amount, 0);
                const isFullyPaid = totalPaid >= (booking.totalAmount || 0) && (booking.totalAmount || 0) > 0;
                
                return (
                  <div key={booking.id} className="bg-lightGray rounded-md p-4 border border-mediumGray">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-black">{booking.customerName}</p>
                        <p className="text-sm text-darkGray">{booking.eventType}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        isFullyPaid ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {isFullyPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-darkGray">
                        {eventDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="font-semibold text-black">
                        ₱{(booking.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-darkGray text-center py-8 italic">No upcoming events in the next 30 days</p>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <div className="flex items-center gap-2 mb-4">
            <DollarIcon className="w-6 h-6 text-primaryRed" />
            <h2 className="text-xl font-bold text-black">Recent Payments</h2>
          </div>
          {recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentPayments.map((payment) => {
                const booking = bookings.find(b => b.id === payment.bookingId);
                return (
                  <div key={payment.id} className="bg-lightGray rounded-md p-4 border border-mediumGray">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-black">₱{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-darkGray">
                          {booking?.customerName || 'Unknown'} - {payment.paymentType}
                        </p>
                        {payment.referenceNumber && (
                          <p className="text-xs text-darkGray font-mono mt-1">
                            Ref: {payment.referenceNumber}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-darkGray">
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-darkGray">
                      <span className="px-2 py-1 bg-white rounded border border-mediumGray">
                        {payment.paymentMethod}
                      </span>
                      {payment.validatedBy && (
                        <span>Validated by: {payment.validatedBy}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-darkGray text-center py-8 italic">No recent payments</p>
          )}
        </div>
      </div>

      {/* Overdue Payments Alert */}
      {overdueBookings.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-800">Overdue Payments</h2>
            <span className="ml-auto text-sm font-semibold text-red-700 bg-red-200 px-3 py-1 rounded">
              {overdueBookings.length} {overdueBookings.length === 1 ? 'Booking' : 'Bookings'}
            </span>
          </div>
          <div className="space-y-3">
            {overdueBookings.slice(0, 5).map((booking) => {
              const eventDate = new Date(booking.eventDate + 'T00:00:00');
              const deadlines = calculateDeadlines(eventDate);
              const bookingPayments = payments.filter(p => p.bookingId === booking.id);
              const totalPaid = bookingPayments.reduce((s, p) => s + p.amount, 0);
              const downpaymentPaid = bookingPayments
                .filter(p => p.paymentType === 'downpayment' || p.paymentType === 'reservation')
                .reduce((s, p) => s + p.amount, 0);
              const downpaymentAmount = (booking.totalAmount || 0) * 0.5;
              const remaining = (booking.totalAmount || 0) - totalPaid;
              
              return (
                <div key={booking.id} className="bg-white rounded-md p-4 border-2 border-red-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-black">{booking.customerName}</p>
                      <p className="text-sm text-darkGray">
                        Event: {eventDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-red-800 bg-red-200 px-2 py-1 rounded">
                      Overdue
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-darkGray">Remaining Balance</p>
                      <p className="font-bold text-red-600">₱{remaining.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-darkGray">Total Amount</p>
                      <p className="font-semibold text-black">₱{(booking.totalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-lightGray rounded-lg p-6 border border-mediumGray">
        <h2 className="text-xl font-bold text-black mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-darkGray">Total Bookings</p>
            <p className="text-2xl font-bold text-black">{bookings.length}</p>
          </div>
          <div>
            <p className="text-sm text-darkGray">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{cancelledBookings}</p>
          </div>
          <div>
            <p className="text-sm text-darkGray">Total Payments</p>
            <p className="text-2xl font-bold text-black">{payments.length}</p>
          </div>
          <div>
            <p className="text-sm text-darkGray">Avg Payment</p>
            <p className="text-2xl font-bold text-black">
              ₱{payments.length > 0 ? Math.round(totalRevenue / payments.length).toLocaleString() : '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

