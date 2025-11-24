
import React from 'react';
import { Logo } from '../Logo';
import { CalendarIcon, MailIcon } from '../icons';
import { AdminView } from './AdminPortal';

interface SidebarProps {
    activeView: AdminView;
    onNavigate: (view: AdminView) => void;
    isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen }) => {
  return (
    <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0f1115] text-white flex flex-col transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="h-20 flex items-center justify-center border-b border-white/10 bg-black/20">
        <a href="#/admin">
            <Logo theme="dark" className="h-8 w-auto" />
        </a>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#/admin/schedule"
          onClick={(e) => { e.preventDefault(); onNavigate('schedule'); }}
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
            ${activeView === 'schedule' 
                ? 'bg-primaryRed text-white font-semibold shadow-[0_0_20px_rgba(217,38,38,0.4)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          <CalendarIcon className={`w-5 h-5 mr-3 transition-colors ${activeView === 'schedule' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
          <span>Schedule</span>
        </a>
        
        <a
          href="#/admin/inquiries"
          onClick={(e) => { e.preventDefault(); onNavigate('inquiries'); }}
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
            ${activeView === 'inquiries' 
                ? 'bg-primaryRed text-white font-semibold shadow-[0_0_20px_rgba(217,38,38,0.4)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          <MailIcon className={`w-5 h-5 mr-3 transition-colors ${activeView === 'inquiries' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
          <span>Inquiries</span>
        </a>
      </nav>
      
      <div className="px-4 py-6 border-t border-white/10 bg-black/20">
          <a href="#" className="flex items-center text-gray-400 hover:text-white text-sm transition-colors">
            <span className="mr-2">&larr;</span> Back to Main Site
          </a>
      </div>
    </aside>
  );
};
