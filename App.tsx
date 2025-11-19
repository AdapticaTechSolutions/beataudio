import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { EventTypes } from './components/EventTypes';
import { Packages } from './components/Packages';
import { BookingFlow } from './components/BookingFlow';
import { Portfolio } from './components/Portfolio';
import { DownpaymentInfo } from './components/DownpaymentInfo';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MobileNav } from './components/MobileNav';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll to anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#/admin')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const handleOpenBookingModal = useCallback(() => {
    setIsBookingModalOpen(true);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAdminAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    window.location.hash = '#/admin';
  }, []);
  
  const renderContent = () => {
    if (route.startsWith('#/admin')) {
      if (isAdminAuthenticated) {
        return <AdminPortal onLogout={handleLogout} />;
      }
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return (
      <>
        <Header onBookNowClick={handleOpenBookingModal} />
        <main>
          <Hero onBookNowClick={handleOpenBookingModal} />
          <Services />
          <EventTypes />
          <Packages onBookNowClick={handleOpenBookingModal} />
          <BookingFlow onBookNowClick={handleOpenBookingModal} />
          <Portfolio />
          <DownpaymentInfo />
          <Contact />
        </main>
        <Footer />
        <MobileNav onBookNowClick={handleOpenBookingModal} />
        {isBookingModalOpen && <BookingModal onClose={handleCloseBookingModal} />}
      </>
    );
  };


  return (
    <div className="bg-white text-black font-sans selection:bg-primaryRed selection:text-white">
      {renderContent()}
    </div>
  );
};

export default App;