
import React, { useState, useMemo } from 'react';
import type { Booking } from '../../types';
import { CalendarIcon, ListIcon } from '../icons';
import { BookingDetailsModal } from './BookingDetailsModal';

const statusColors: { [key in Booking['status']]: { bg: string; text: string; dot: string; border: string; } } = {
  Inquiry: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', border: 'border-gray-500' },
  QuoteSent: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', border: 'border-yellow-500' },
  Confirmed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', border: 'border-green-500' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', border: 'border-red-500' },
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const formatDateToISO = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const ListView: React.FC<{ bookings: Booking[]; onBookingClick: (booking: Booking) => void }> = ({ bookings, onBookingClick }) => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden mt-6">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-lightGray border-b border-mediumGray">
          <tr>
            <th className="p-4 font-semibold text-black">Booking ID</th>
            <th className="p-4 font-semibold text-black">Customer</th>
            <th className="p-4 font-semibold text-black">Event Date</th>
            <th className="p-4 font-semibold text-black">Event Type</th>
            <th className="p-4 font-semibold text-black">Services</th>
            <th className="p-4 font-semibold text-black">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr 
              key={booking.id} 
              className="border-b border-mediumGray/50 last:border-b-0 hover:bg-lightGray/50 cursor-pointer"
              onClick={() => onBookingClick(booking)}
            >
              <td className="p-4 text-darkGray font-mono text-sm">{booking.id}</td>
              <td className="p-4 text-black font-medium">{booking.customerName}</td>
              <td className="p-4 text-darkGray">{new Date(booking.eventDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="p-4 text-darkGray">{booking.eventType}</td>
              <td className="p-4 text-darkGray text-sm">{booking.services.join(', ')}</td>
              <td className="p-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status].bg} ${statusColors[booking.status].text}`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CalendarView: React.FC<{ bookings: Booking[]; onBookingClick: (booking: Booking) => void }> = ({ bookings, onBookingClick }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const bookingsByDate = useMemo(() => {
        const map = new Map<string, Booking[]>();
        bookings.forEach(booking => {
            const dateStr = booking.eventDate;
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(booking);
        });
        return map;
    }, [bookings]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const days = [];
    let day = new Date(startDate);
    while (days.length < 42) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const selectedDayBookings = selectedDate ? bookingsByDate.get(formatDateToISO(selectedDate)) || [] : [];
    
    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-card p-4">
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={prevMonth} className="px-2 py-1 rounded hover:bg-mediumGray text-lg font-bold">&lt;</button>
                    <h3 className="font-bold text-lg text-black">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button type="button" onClick={nextMonth} className="px-2 py-1 rounded hover:bg-mediumGray text-lg font-bold">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-darkGray font-semibold">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {days.map((d, i) => {
                        const dayString = formatDateToISO(d);
                        const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                        const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
                        const dayBookings = bookingsByDate.get(dayString) || [];

                        let className = "relative w-full aspect-square rounded-lg flex items-center justify-center transition-colors duration-200 text-sm flex-col p-1 ";

                        if (!isCurrentMonth) {
                            className += "text-mediumGray cursor-default";
                        } else {
                            className += "cursor-pointer text-black ";
                            if (isSelected) {
                                className += "bg-primaryRed text-white font-bold ring-2 ring-primaryRed/50 ";
                            } else if (isSameDay(d, today)) {
                                className += "bg-lightGray border-2 border-primaryRed/50 ";
                            } else {
                                className += "hover:bg-primaryRed/10 ";
                            }
                        }

                        return (
                            <div key={i} onClick={() => isCurrentMonth && setSelectedDate(d)} className={className}>
                                <span className={isSelected ? 'font-bold' : ''}>{d.getDate()}</span>
                                {isCurrentMonth && dayBookings.length > 0 && (
                                    <div className="flex space-x-1 mt-1">
                                        {dayBookings.slice(0, 3).map(b => (
                                            <span key={b.id} className={`w-1.5 h-1.5 rounded-full ${statusColors[b.status].dot}`}></span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-4">
                <h3 className="font-bold text-lg text-black mb-4 border-b pb-2">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
                </h3>
                <div className="space-y-4 max-h-[450px] overflow-y-auto">
                    {selectedDayBookings.length > 0 ? (
                        selectedDayBookings.map(booking => (
                            <div 
                                key={booking.id} 
                                className={`p-3 bg-lightGray rounded-md border-l-4 ${statusColors[booking.status].border} cursor-pointer hover:bg-mediumGray transition-colors`}
                                onClick={() => onBookingClick(booking)}
                            >
                                <p className="font-semibold text-black">{booking.customerName}</p>
                                <p className="text-sm text-darkGray">{booking.eventType} - {booking.services.join(', ')}</p>
                                <div className="flex items-center mt-1">
                                  <span className={`w-2 h-2 rounded-full mr-2 ${statusColors[booking.status].dot}`}></span>
                                  <span className={`text-xs font-semibold ${statusColors[booking.status].text}`}>{booking.status}</span>
                                </div>
                                <p className="text-xs text-darkGray mt-2">Click to view details</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-darkGray text-center mt-8">{selectedDate ? 'No bookings for this date.' : 'Click on a date in the calendar to see booking details.'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ScheduleView: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    
    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-black">Booking Schedule</h1>
                <div className="flex items-center gap-2 p-1 bg-mediumGray rounded-lg">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-darkGray hover:text-black'}`}
                    >
                        <ListIcon className="w-5 h-5 mr-1.5" />
                        List
                    </button>
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center ${viewMode === 'calendar' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-darkGray hover:text-black'}`}
                    >
                        <CalendarIcon className="w-5 h-5 mr-1.5" />
                        Calendar
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <ListView bookings={bookings} onBookingClick={handleBookingClick} />
            ) : (
                <CalendarView bookings={bookings} onBookingClick={handleBookingClick} />
            )}

            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};
