import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  bookedDates: string[]; // format YYYY-MM-DD
}

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

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, bookedDates }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minBookableDate = new Date(today);
  minBookableDate.setMonth(minBookableDate.getMonth() + 1);
  
  const [currentDate, setCurrentDate] = useState(new Date(minBookableDate));

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());

  const days = [];
  let day = startDate;
  while (days.length < 42) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const firstAllowedMonth = new Date(minBookableDate.getFullYear(), minBookableDate.getMonth(), 1);
  const currentCalendarMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const canGoBack = currentCalendarMonth > firstAllowedMonth;

  return (
    <div className="bg-lightGray p-4 rounded-lg border border-mediumGray">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} disabled={!canGoBack} className="px-2 py-1 rounded hover:bg-mediumGray text-lg font-bold disabled:text-darkGray/50 disabled:cursor-not-allowed">&lt;</button>
        <h3 className="font-bold text-lg text-black">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button type="button" onClick={nextMonth} className="px-2 py-1 rounded hover:bg-mediumGray text-lg font-bold">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-darkGray font-semibold">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((d, i) => {
          const dayString = formatDateToISO(d);
          const isBooked = bookedDates.includes(dayString);
          const isPast = d < minBookableDate;
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
          const isToday = isSameDay(d, new Date());
          
          const isDisabled = isBooked || isPast;

          let className = "w-full aspect-square rounded-full flex items-center justify-center transition-colors duration-200 text-sm ";
          
          if (!isCurrentMonth) {
            className += "text-mediumGray cursor-default";
          } else if (isDisabled) {
            className += "bg-mediumGray text-darkGray/50 cursor-not-allowed line-through ";
          } else {
            className += "cursor-pointer text-black ";
            if (isSelected) {
                className += "bg-primaryRed text-white font-bold ring-2 ring-primaryRed/50 ";
            } else if (isToday) {
                className += "border-2 border-primaryRed/50 ";
            } else {
                className += "hover:bg-primaryRed/10 ";
            }
          }
          
          return (
            <div key={i} className="relative">
                <button
                type="button"
                onClick={() => !isDisabled && isCurrentMonth && onDateSelect(d)}
                disabled={isDisabled || !isCurrentMonth}
                className={className}
                >
                {d.getDate()}
                </button>
                {isBooked && isCurrentMonth && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-red-700/80 font-semibold uppercase tracking-tighter">Booked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
