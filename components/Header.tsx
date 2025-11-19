import React, { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from './icons';
import { Logo } from './Logo';

interface HeaderProps {
  onBookNowClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookNowClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Services', 'Packages', 'Portfolio', 'Contact'];

  const logoTheme = isScrolled ? 'light' : 'dark';
  const navTextColor = isScrolled ? 'text-black' : 'text-white';
  const headerBg = isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent';


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <a 
            href="#home" 
            aria-label="Beat Audio & Lights Homepage"
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <Logo className="h-10 sm:h-12 w-auto" theme={logoTheme} />
          </a>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className={`${navTextColor} font-medium text-sm lg:text-base hover:text-primaryRed transition-all duration-300 relative group`}
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primaryRed transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <button
              onClick={onBookNowClick}
              className="bg-primaryRed text-white font-bold py-2.5 px-6 lg:px-8 rounded-full hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm lg:text-base relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Book Now <span className="text-xs opacity-90">(₱1,000)</span></span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`${navTextColor} p-2 transition-colors duration-300 hover:text-primaryRed`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="md:hidden bg-white/98 backdrop-blur-lg absolute top-20 sm:top-24 left-0 right-0 shadow-xl border-t border-mediumGray/30 animate-in slide-in-from-top duration-300 z-50"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the menu content
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <nav className="flex flex-col items-center space-y-2 py-6 px-4" onClick={(e) => e.stopPropagation()}>
            {navLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="text-black text-lg font-medium hover:text-primaryRed transition-colors duration-300 py-2 px-4 w-full text-center rounded-lg hover:bg-lightGray"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                // Small delay to ensure menu closes before modal opens
                setTimeout(() => {
                  onBookNowClick();
                }, 100);
              }}
              className="bg-primaryRed text-white font-bold py-3 px-8 rounded-full mt-4 hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105 active:scale-95 w-full max-w-xs"
            >
              Book Now <span className="text-xs opacity-90">(₱1,000)</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};