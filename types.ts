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
  createdAt?: string;
  updatedAt?: string;
  fullName?: string; // From booking form
  celNumber?: string; // From booking form
  venueAddress?: string; // From booking form
  weddingSetup?: string; // From booking form
  serviceLights?: boolean;
  serviceSounds?: boolean;
  serviceLedWall?: boolean;
  serviceProjector?: boolean;
  serviceSmoke?: boolean;
  hasBand?: boolean;
  additionalNotes?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  passwordHash: string; // In production, use proper hashing
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'passwordHash'>;
  error?: string;
}