import React, { useState } from 'react';
import type { Booking } from '../../types';

interface OrderHistoryViewProps {
  bookings: Booking[];
  currentUser: { id: string; username: string; role: string };
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ bookings, currentUser }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out archived bookings
  const activeBookings = bookings.filter(b => !b.archived);

  // Filter by status
  const filteredByStatus = statusFilter === 'all'
    ? activeBookings
    : activeBookings.filter(b => b.status === statusFilter);

  // Filter by search query
  const filteredBookings = searchQuery
    ? filteredByStatus.filter(b =>
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.venue.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByStatus;

  const getStatusBadge = (status: string) => {
    const styles = {
      Inquiry: 'bg-yellow-100 text-yellow-800',
      QuoteSent: 'bg-blue-100 text-blue-800',
      Confirmed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: activeBookings.length,
    inquiry: activeBookings.filter(b => b.status === 'Inquiry').length,
    quoteSent: activeBookings.filter(b => b.status === 'QuoteSent').length,
    confirmed: activeBookings.filter(b => b.status === 'Confirmed').length,
    cancelled: activeBookings.filter(b => b.status === 'Cancelled').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Order History</h1>
          <p className="text-darkGray mt-1">View and manage all bookings and orders.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-card p-4 border border-mediumGray">
          <p className="text-xs text-darkGray mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 border border-mediumGray">
          <p className="text-xs text-darkGray mb-1">Inquiries</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inquiry}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 border border-mediumGray">
          <p className="text-xs text-darkGray mb-1">Quotes Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.quoteSent}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 border border-mediumGray">
          <p className="text-xs text-darkGray mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 border border-mediumGray">
          <p className="text-xs text-darkGray mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6 border border-mediumGray">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-black mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, ID, email, or venue..."
              className="w-full border border-mediumGray rounded-lg p-2"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-bold text-black mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-mediumGray rounded-lg p-2"
            >
              <option value="all">All Status</option>
              <option value="Inquiry">Inquiry</option>
              <option value="QuoteSent">Quote Sent</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden border border-mediumGray">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-lightGray border-b border-mediumGray">
              <tr>
                <th className="p-4 font-semibold text-black text-sm">Order ID</th>
                <th className="p-4 font-semibold text-black text-sm">Client</th>
                <th className="p-4 font-semibold text-black text-sm">Event</th>
                <th className="p-4 font-semibold text-black text-sm">Date</th>
                <th className="p-4 font-semibold text-black text-sm">Venue</th>
                <th className="p-4 font-semibold text-black text-sm">Amount</th>
                <th className="p-4 font-semibold text-black text-sm">Status</th>
                <th className="p-4 font-semibold text-black text-sm">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-mediumGray/50 last:border-b-0 hover:bg-lightGray/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm text-darkGray">{booking.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-black">{booking.customerName}</p>
                        <p className="text-xs text-darkGray">{booking.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-black">{booking.eventType}</td>
                    <td className="p-4 text-sm text-darkGray">
                      {new Date(booking.eventDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-darkGray max-w-xs truncate">
                      {booking.venue}
                    </td>
                    <td className="p-4 text-sm font-bold text-black">
                      {booking.totalAmount ? `₱${booking.totalAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-darkGray">
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-darkGray italic">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-darkGray">
        Showing {filteredBookings.length} of {activeBookings.length} orders
      </div>
    </div>
  );
};

