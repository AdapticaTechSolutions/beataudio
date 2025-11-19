
import React from 'react';
import { Logo } from '../Logo';
import { CalendarIcon, CheckSquareIcon } from '../icons';

interface SidebarProps {
    activeView: 'schedule' | 'validation';
    onNavigate: (view: 'schedule' | 'validation') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside className="w-64 bg-black text-white flex-col hidden md:flex">
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <a href="#">
            <Logo theme="dark" className="h-10 w-auto" />
        </a>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#/admin/schedule"
          onClick={(e) => { e.preventDefault(); onNavigate('schedule'); }}
          className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeView === 'schedule' ? 'bg-primaryRed text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          <CalendarIcon className="w-5 h-5 mr-3" />
          <span>Schedule</span>
        </a>
        <a
          href="#/admin/validation"
          onClick={(e) => { e.preventDefault(); onNavigate('validation'); }}
          className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeView === 'validation' ? 'bg-primaryRed text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          <CheckSquareIcon className="w-5 h-5 mr-3" />
          <span>Pending Validation</span>
        </a>
      </nav>
       <div className="px-4 py-6 border-t border-gray-700">
          <a href="#" className="text-gray-400 hover:text-white text-sm">&larr; Back to Main Site</a>
      </div>
    </aside>
  );
};
