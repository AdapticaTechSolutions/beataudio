import React from 'react';
import { HomeIcon, MailIcon } from './icons';

interface MobileNavProps {
    onBookNowClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onBookNowClick }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-mediumGray z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-around">
                <a href="#" className="flex flex-col items-center text-black hover:text-primaryRed transition-colors">
                    <HomeIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">Home</span>
                </a>
                <a href="#contact" className="flex flex-col items-center text-black hover:text-primaryRed transition-colors">
                    <MailIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">Contact</span>
                </a>
                <button 
                    onClick={onBookNowClick}
                    className="bg-primaryRed text-white font-bold py-3 px-6 rounded-full text-sm shadow-soft-red"
                >
                    Get Quote
                </button>
            </div>
        </div>
    );
};