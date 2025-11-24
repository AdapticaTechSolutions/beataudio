
import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { Sidebar } from './Sidebar';
import { ScheduleView } from './ScheduleView';
import { InquiriesView } from './InquiriesView'; 
import { bookingsApi } from '../../lib/api';
import type { Booking } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

export type AdminView = 'schedule' | 'inquiries';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('schedule');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-lightGray font-sans flex relative">
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader 
            onLogout={onLogout} 
            onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
        />
        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
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
              {activeView === 'inquiries' && <InquiriesView bookings={bookings} onGenerateQuote={handleGenerateQuote} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
