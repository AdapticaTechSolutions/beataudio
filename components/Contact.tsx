import React from 'react';
import { FacebookIcon, MailIcon } from './icons';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 sm:py-28 bg-gradient-to-b from-white to-lightGray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Get in Touch
          </h2>
          <p className="text-lg sm:text-xl text-darkGray max-w-2xl mx-auto leading-relaxed">
            Have questions? We're here to help you plan the perfect event. Let's create something amazing together.
          </p>
          <div className="mt-6 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        
        {/* Improved grid layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact form with enhanced styling */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-mediumGray/30">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-black">Quick Inquiry</h3>
            <p className="text-darkGray mb-6 text-sm sm:text-base">Fill out the form below and we'll get back to you within 24 hours.</p>
            
            <form className="space-y-5">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black 
                             focus:ring-2 focus:ring-primaryRed focus:border-primaryRed 
                             outline-none transition-all duration-300 hover:border-primaryRed/50
                             placeholder:text-darkGray/60"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black 
                             focus:ring-2 focus:ring-primaryRed focus:border-primaryRed 
                             outline-none transition-all duration-300 hover:border-primaryRed/50
                             placeholder:text-darkGray/60"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Event Type" 
                  className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black 
                             focus:ring-2 focus:ring-primaryRed focus:border-primaryRed 
                             outline-none transition-all duration-300 hover:border-primaryRed/50
                             placeholder:text-darkGray/60"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Tell us about your event..." 
                  rows={5} 
                  className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black 
                             focus:ring-2 focus:ring-primaryRed focus:border-primaryRed 
                             outline-none transition-all duration-300 hover:border-primaryRed/50 resize-none
                             placeholder:text-darkGray/60"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primaryRed text-white font-bold py-4 px-6 rounded-full 
                           hover:bg-opacity-90 hover:shadow-soft-red 
                           transition-all duration-300 transform hover:scale-105 active:scale-95
                           text-base sm:text-lg relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Send Message</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>
          </div>
          
          {/* Contact info and social with enhanced styling */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Live Chat Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-mediumGray/30">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-black">Live Chat</h3>
              <p className="text-darkGray mb-6 leading-relaxed">
                For faster responses, connect with us directly on Facebook Messenger. We typically respond within minutes during business hours.
              </p>
              <a 
                href="https://m.me/your-facebook-page" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-full 
                           hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95
                           text-base sm:text-lg shadow-lg hover:shadow-xl"
              >
                <FacebookIcon className="w-6 h-6 mr-3" />
                Chat on Messenger
              </a>
            </div>
            
            {/* Contact Details Card */}
            <div className="bg-gradient-to-br from-primaryRed/5 to-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-primaryRed/20">
              <h4 className="text-xl sm:text-2xl font-serif font-bold mb-6 text-black flex items-center">
                <MailIcon className="w-6 h-6 mr-2 text-primaryRed" />
                Contact Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-primaryRed mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <a href="mailto:bookings@beataudio.ph" className="text-darkGray hover:text-primaryRed transition-colors duration-300 ml-3">
                    bookings@beataudio.ph
                  </a>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-primaryRed mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <a href="tel:+639171234567" className="text-darkGray hover:text-primaryRed transition-colors duration-300 ml-3">
                    +63 917 123 4567
                  </a>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-primaryRed mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-darkGray ml-3">Manila, Philippines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};