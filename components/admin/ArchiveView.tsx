import React, { useState } from 'react';
import type { Booking } from '../../types';
import { bookingsApi } from '../../lib/api';

interface ArchiveViewProps {
  bookings: Booking[];
  onRefresh: () => void;
  currentUser: { id: string; username: string; role: string };
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ bookings, onRefresh, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isArchiving, setIsArchiving] = useState<string | null>(null);
  const [isUnarchiving, setIsUnarchiving] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Filter archived bookings
  const archivedBookings = bookings.filter(b => b.archived);
  const activeBookings = bookings.filter(b => !b.archived);

  // Filter by search
  const filteredArchived = searchQuery
    ? archivedBookings.filter(b =>
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : archivedBookings;

  const handleArchive = async (bookingId: string) => {
    if (!isAdmin) {
      alert('Only administrators can archive bookings');
      return;
    }

    if (!window.confirm('Are you sure you want to archive this booking? It will be moved to the archive.')) {
      return;
    }

    setIsArchiving(bookingId);
    try {
      const response = await bookingsApi.update(bookingId, {
        archived: true,
        archivedAt: new Date().toISOString(),
        archivedBy: currentUser.username,
      });

      if (response.success) {
        onRefresh();
        alert('Booking archived successfully');
      } else {
        alert(response.error || 'Failed to archive booking');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsArchiving(null);
    }
  };

  const handleUnarchive = async (bookingId: string) => {
    if (!isAdmin) {
      alert('Only administrators can unarchive bookings');
      return;
    }

    if (!window.confirm('Are you sure you want to restore this booking from archive?')) {
      return;
    }

    setIsUnarchiving(bookingId);
    try {
      const response = await bookingsApi.update(bookingId, {
        archived: false,
        archivedAt: undefined,
        archivedBy: undefined,
      });

      if (response.success) {
        onRefresh();
        alert('Booking restored successfully');
      } else {
        alert(response.error || 'Failed to restore booking');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsUnarchiving(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Archive</h1>
          <p className="text-darkGray mt-1">Manage archived bookings and restore if needed.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <p className="text-sm text-darkGray mb-1">Archived Bookings</p>
          <p className="text-3xl font-bold text-gray-600">{archivedBookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6 border border-mediumGray">
          <p className="text-sm text-darkGray mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-green-600">{activeBookings.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6 border border-mediumGray">
        <label className="block text-sm font-bold text-black mb-2">Search Archived</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, ID, or email..."
          className="w-full border border-mediumGray rounded-lg p-2"
        />
      </div>

      {/* Active Bookings (can be archived) */}
      {isAdmin && activeBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">Active Bookings (Can Archive)</h2>
          <div className="bg-white rounded-lg shadow-card overflow-hidden border border-mediumGray">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-lightGray border-b border-mediumGray">
                  <tr>
                    <th className="p-4 font-semibold text-black text-sm">ID</th>
                    <th className="p-4 font-semibold text-black text-sm">Client</th>
                    <th className="p-4 font-semibold text-black text-sm">Event</th>
                    <th className="p-4 font-semibold text-black text-sm">Date</th>
                    <th className="p-4 font-semibold text-black text-sm">Status</th>
                    <th className="p-4 font-semibold text-black text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBookings.slice(0, 10).map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-mediumGray/50 last:border-b-0"
                    >
                      <td className="p-4 font-mono text-sm text-darkGray">{booking.id}</td>
                      <td className="p-4">
                        <p className="font-semibold text-black">{booking.customerName}</p>
                        <p className="text-xs text-darkGray">{booking.email}</p>
                      </td>
                      <td className="p-4 text-sm text-black">{booking.eventType}</td>
                      <td className="p-4 text-sm text-darkGray">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded font-semibold bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleArchive(booking.id)}
                          disabled={isArchiving === booking.id}
                          className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                          {isArchiving === booking.id ? 'Archiving...' : 'Archive'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Archived Bookings */}
      <div>
        <h2 className="text-xl font-bold text-black mb-4">Archived Bookings</h2>
        {filteredArchived.length > 0 ? (
          <div className="bg-white rounded-lg shadow-card overflow-hidden border border-mediumGray">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-lightGray border-b border-mediumGray">
                  <tr>
                    <th className="p-4 font-semibold text-black text-sm">ID</th>
                    <th className="p-4 font-semibold text-black text-sm">Client</th>
                    <th className="p-4 font-semibold text-black text-sm">Event</th>
                    <th className="p-4 font-semibold text-black text-sm">Date</th>
                    <th className="p-4 font-semibold text-black text-sm">Status</th>
                    <th className="p-4 font-semibold text-black text-sm">Archived By</th>
                    <th className="p-4 font-semibold text-black text-sm">Archived At</th>
                    {isAdmin && (
                      <th className="p-4 font-semibold text-black text-sm">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredArchived.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-mediumGray/50 last:border-b-0 opacity-75"
                    >
                      <td className="p-4 font-mono text-sm text-darkGray">{booking.id}</td>
                      <td className="p-4">
                        <p className="font-semibold text-black">{booking.customerName}</p>
                        <p className="text-xs text-darkGray">{booking.email}</p>
                      </td>
                      <td className="p-4 text-sm text-black">{booking.eventType}</td>
                      <td className="p-4 text-sm text-darkGray">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded font-semibold bg-gray-100 text-gray-800">
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-darkGray">
                        {booking.archivedBy || '-'}
                      </td>
                      <td className="p-4 text-xs text-darkGray">
                        {booking.archivedAt
                          ? new Date(booking.archivedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      {isAdmin && (
                        <td className="p-4">
                          <button
                            onClick={() => handleUnarchive(booking.id)}
                            disabled={isUnarchiving === booking.id}
                            className="text-xs px-3 py-1 bg-primaryRed text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
                          >
                            {isUnarchiving === booking.id ? 'Restoring...' : 'Restore'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-card p-8 text-center border border-mediumGray">
            <p className="text-darkGray italic">No archived bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

