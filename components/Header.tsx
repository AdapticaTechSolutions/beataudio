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

  const navLinks = ['Services', 'Portfolio', 'Contact'];

  const logoTheme = isScrolled ? 'light' : 'dark';
  const navTextColor = isScrolled ? 'text-black' : 'text-white';
  const headerBg = isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent';


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" aria-label="Beat Audio & Lights Homepage">
            <Logo className="h-10 w-auto" theme={logoTheme} />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className={`${navTextColor} hover:text-primaryRed transition-colors duration-300`}>{link}</a>
            ))}
            <button
              onClick={onBookNowClick}
              className="bg-primaryRed text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105"
            >
              Get a Quote
            </button>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={navTextColor}>
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg absolute top-20 left-0 right-0">
          <nav className="flex flex-col items-center space-y-4 py-8">
            {navLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="text-black text-lg hover:text-primaryRed transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => {
                onBookNowClick();
                setIsMobileMenuOpen(false);
              }}
              className="bg-primaryRed text-white font-bold py-3 px-8 rounded-full mt-4 hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300 transform hover:scale-105"
            >
              Get a Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};