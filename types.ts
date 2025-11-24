import React from 'react';

export interface Service {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface EventType {
  name: string;
  image: string;
}

export interface Package {
  name: string;
  description: string;
  priceRange: string;
  inclusions: string[];
  image: string;
  badge?: string;
}

export interface PortfolioItem {
  id: number;
  category: string;
  image: string;
  title: string;
}

export interface Booking {
  id: string;
  customerName: string;
  contactNumber: string;
  email: string;
  eventDate: string;
  eventType: string;
  venue: string;
  ceremonyVenue?: string; // Specific for weddings
  guestCount: number;
  services: string[]; // e.g. ["Lights", "Sounds", "LED Wall"]
  bandRider?: string;
  totalAmount?: number; // Set by admin
  status: 'Inquiry' | 'QuoteSent' | 'Confirmed' | 'Cancelled';
}