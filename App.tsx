import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { EventTypes } from './components/EventTypes';
import { BookingFlow } from './components/BookingFlow';
import { Portfolio } from './components/Portfolio';
import { DownpaymentInfo } from './components/DownpaymentInfo';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MobileNav } from './components/MobileNav';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';
import { ClientQuotePage } from './components/ClientQuotePage';
import { BOOKINGS } from './constants';

// Background photos array - rotating through different event photos
const backgroundPhotos = [
  '/photos/Wedding/Tagaytay/Wedding 1/571175692_1398540528938547_5239243637261797162_n.jpg',
  '/photos/Wedding/Tagaytay/Wedding 2/571154389_1395347699257830_3254642409205276693_n.jpg',
  '/photos/Wedding/Tagaytay/Wedding 1/571343221_1398540378938562_4804558161343445364_n.jpg',
  '/photos/Wedding/Tagaytay/Wedding 2/570250651_1395348172591116_5351188878399276855_n.jpg',
  '/photos/Wedding/Tagaytay/Wedding 1/573525482_1398541242271809_8857528343959349941_n.jpg',
  '/photos/Wedding/Tagaytay/October/573622897_1401393865319880_3446976281434024146_n.jpg',
  '/photos/Wedding/Tagaytay/Wedding 2/568775426_1395348662591067_1388472842652633311_n.jpg',
  '/photos/Wedding/Nuke Taal Wedding/565202926_1388785003247433_3442356210091897347_n.jpg',
];

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Preload all background images for smooth transitions
  useEffect(() => {
    backgroundPhotos.forEach((photo) => {
      const img = new Image();
      img.src = photo;
    });
  }, []);

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prev) => (prev + 1) % backgroundPhotos.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
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
    // Admin Route
    if (route.startsWith('#/admin')) {
      if (isAdminAuthenticated) {
        return <AdminPortal onLogout={handleLogout} />;
      }
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    // Client Quote Route (e.g., #/quote/BA-2025-1004)
    if (route.startsWith('#/quote/')) {
        const bookingId = route.split('/quote/')[1];
        // In a real app, fetch from API. Here we find in mocks.
        const booking = BOOKINGS.find(b => b.id === bookingId);
        
        if (booking) {
            return <ClientQuotePage booking={booking} onPaymentComplete={() => {
                // In real app, re-fetch status
                booking.status = 'Confirmed';
                alert("Payment Success! Redirecting...");
                window.location.hash = '';
            }} />;
        } else {
            return <div className="flex items-center justify-center h-screen">Quote not found.</div>;
        }
    }

    // Main Public Site
    return (
      <>
        <Header onBookNowClick={handleOpenBookingModal} />
        <main>
          <Hero onBookNowClick={handleOpenBookingModal} />
          <Services />
          <EventTypes />
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
    <div className="text-black font-sans selection:bg-primaryRed selection:text-white min-h-screen">
      {/* Global Background Image - covers entire page */}
      <div className="fixed inset-0 z-0">
        {backgroundPhotos.map((photo, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ${
              index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${photo}')` }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ))}
      </div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;