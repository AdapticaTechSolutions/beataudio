
import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { Sidebar } from './Sidebar';
import { ScheduleView } from './ScheduleView';
import { InquiriesView } from './InquiriesView';
import { OrderHistoryView } from './OrderHistoryView';
import { PaymentHistoryView } from './PaymentHistoryView';
import { ArchiveView } from './ArchiveView';
import { QuoteEditor } from './QuoteEditor';
import { bookingsApi } from '../../lib/api';
import type { Booking, User } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

export type AdminView = 'schedule' | 'inquiries' | 'orders' | 'payments' | 'archive';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('schedule');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingQuote, setEditingQuote] = useState<Booking | null>(null);

  // Get current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsApi.getAll();
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        console.error('Failed to fetch bookings:', response.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync state with Hash on mount and hashchange
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash.includes('/admin/inquiries')) {
        setActiveView('inquiries');
      } else if (hash.includes('/admin/orders')) {
        setActiveView('orders');
      } else if (hash.includes('/admin/payments')) {
        setActiveView('payments');
      } else if (hash.includes('/admin/archive')) {
        setActiveView('archive');
      } else if (hash.includes('/admin/schedule')) {
        setActiveView('schedule');
      }
    };

    handleHashSync(); // Initial sync
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Update hash when view changes
  const handleNavigate = (view: AdminView) => {
    setActiveView(view);
    window.location.hash = `#/admin/${view}`;
    setIsMobileSidebarOpen(false); // Close mobile menu on navigate
  };

  const handleGenerateQuote = async (bookingId: string) => {
    const quoteAmount = 35000; 
    try {
      const response = await bookingsApi.update(bookingId, {
        status: 'QuoteSent',
        totalAmount: quoteAmount,
      });
      
      if (response.success) {
        setBookings(prevBookings =>
          prevBookings.map(b =>
            b.id === bookingId ? { ...b, status: 'QuoteSent', totalAmount: quoteAmount } : b
          )
        );
        alert(`Link generated for ${bookingId}. \n\nClient Link: ${window.location.origin}/#/quote/${bookingId}`);
      } else {
        alert('Failed to update booking. Please try again.');
      }
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEditQuote = (booking: Booking) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Only administrators can edit quotes');
      return;
    }
    setEditingQuote(booking);
  };

  const handleQuoteSave = (updatedBooking: Booking) => {
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === updatedBooking.id ? updatedBooking : b
      )
    );
    setEditingQuote(null);
  };

  return (
    <div className="min-h-screen font-sans flex relative">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        isOpen={isMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <AdminHeader 
            onLogout={onLogout} 
            onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
        />
        <main className="flex-1 p-4 md:p-10 overflow-y-auto relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryRed mx-auto mb-4"></div>
                <p className="text-darkGray">Loading bookings...</p>
              </div>
            </div>
          ) : (
            <>
              {activeView === 'schedule' && <ScheduleView bookings={bookings} />}
              {activeView === 'inquiries' && (
                <InquiriesView 
                  bookings={bookings} 
                  onGenerateQuote={handleGenerateQuote}
                  onEditQuote={handleEditQuote}
                  currentUser={currentUser || { id: '', username: '', role: 'viewer' }}
                />
              )}
              {activeView === 'orders' && currentUser && (
                <OrderHistoryView 
                  bookings={bookings} 
                  currentUser={currentUser}
                />
              )}
              {activeView === 'payments' && currentUser && (
                <PaymentHistoryView 
                  bookings={bookings}
                  currentUser={currentUser}
                />
              )}
              {activeView === 'archive' && currentUser && (
                <ArchiveView 
                  bookings={bookings}
                  onRefresh={fetchBookings}
                  currentUser={currentUser}
                />
              )}
            </>
          )}
        </main>
      </div>
      {editingQuote && currentUser && (
        <QuoteEditor
          booking={editingQuote}
          onClose={() => setEditingQuote(null)}
          onSave={handleQuoteSave}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
