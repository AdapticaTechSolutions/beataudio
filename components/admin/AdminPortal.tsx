
import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Sidebar } from './Sidebar';
import { ScheduleView } from './ScheduleView';
import { ValidationView } from './ValidationView';
import { BOOKINGS } from '../../constants';
import type { Booking } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

type AdminView = 'schedule' | 'validation';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('schedule');
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);

  const handleValidateBooking = (bookingId: string) => {
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === bookingId ? { ...b, status: 'Confirmed' } : b
      )
    );
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-lightGray font-sans flex">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-6 md:p-10">
          {activeView === 'schedule' && <ScheduleView bookings={bookings} />}
          {activeView === 'validation' && <ValidationView bookings={bookings} onValidate={handleValidateBooking} onReject={handleRejectBooking} />}
        </main>
      </div>
    </div>
  );
};
