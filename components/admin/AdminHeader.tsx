import React from 'react';
import { LogoutIcon } from '../icons';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-md z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="flex items-center text-darkGray hover:text-primaryRed transition-colors duration-200"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
