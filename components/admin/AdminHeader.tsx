
import React from 'react';
import { LogoutIcon, MenuIcon } from '../icons';

interface AdminHeaderProps {
  onLogout: () => void;
  onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-mediumGray z-10 h-20 flex-shrink-0">
      <div className="container mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        <div className="flex items-center">
            {onMenuClick && (
                <button onClick={onMenuClick} className="md:hidden mr-4 text-black p-1 hover:bg-gray-100 rounded">
                    <MenuIcon className="w-6 h-6" />
                </button>
            )}
            <h1 className="text-xl font-serif font-bold text-black hidden sm:block">Admin Dashboard</h1>
            <h1 className="text-xl font-serif font-bold text-black sm:hidden">Admin</h1>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-black">Administrator</p>
                <p className="text-xs text-green-600">● Online</p>
            </div>
            <div className="h-8 w-px bg-mediumGray hidden sm:block"></div>
            <button
            onClick={onLogout}
            className="flex items-center text-darkGray hover:text-primaryRed transition-colors duration-200 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-full"
            >
            <LogoutIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline font-semibold">Logout</span>
            </button>
        </div>
      </div>
    </header>
  );
};
