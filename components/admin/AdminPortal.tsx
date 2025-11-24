
import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { Sidebar } from './Sidebar';
import { ScheduleView } from './ScheduleView';
import { InquiriesView } from './InquiriesView'; 
import { BOOKINGS } from '../../constants';
import type { Booking } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

export type AdminView = 'schedule' | 'inquiries';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('schedule');
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleGenerateQuote = (bookingId: string) => {
    const quoteAmount = 35000; 
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === bookingId ? { ...b, status: 'QuoteSent', totalAmount: quoteAmount } : b
      )
    );
    alert(`Link generated for ${bookingId}. \n\nClient Link: beat-audio.com/#/quote/${bookingId}`);
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
          {activeView === 'schedule' && <ScheduleView bookings={bookings} />}
          {activeView === 'inquiries' && <InquiriesView bookings={bookings} onGenerateQuote={handleGenerateQuote} />}
        </main>
      </div>
    </div>
  );
};
