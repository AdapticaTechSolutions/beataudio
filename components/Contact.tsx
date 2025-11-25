import React from 'react';
import { FacebookIcon } from './icons';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">Get in Touch</h2>
          <p className="text-darkGray mt-2">Have questions? We're here to help you plan the perfect event.</p>
          <div className="mt-4 w-24 h-1 bg-primaryRed mx-auto"></div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Quick Inquiry</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" />
              <input type="email" placeholder="Email Address" className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" />
              <input type="text" placeholder="Event Type" className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" />
              <textarea placeholder="Your Message" rows={4} className="w-full bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"></textarea>
              <button type="submit" className="w-full bg-primaryRed text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 hover:shadow-soft-red transition-all duration-300">Send Message</button>
            </form>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Live Chat</h3>
            <p className="text-darkGray mb-6">For faster responses, connect with us directly on Facebook Messenger.</p>
            <a href="https://m.me/beataudiols" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300">
              <FacebookIcon className="w-6 h-6 mr-3" />
              Chat on Messenger
            </a>
            <div className="mt-8 pt-6 border-t border-mediumGray">
                <h4 className="text-xl font-serif font-bold mb-2">Contact Details</h4>
                <p className="text-darkGray">Email: bookings@beataudio.ph</p>
                <p className="text-darkGray">Phone: +63 917 123 4567</p>
                <p className="text-darkGray">Manila, Philippines</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};