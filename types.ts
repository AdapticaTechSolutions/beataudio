// FIX: Import React to provide the 'React' namespace for types.
import React from 'react';

export interface Service {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface EventType {
  name: string;
  image: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: string;
  image: string;
  description?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

export interface Package {
  name: string;
  description: string;
  priceRange: string;
  inclusions: string[];
  image: string;
  badge?: string;
  venues?: Venue[];
  equipment?: Equipment[];
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
  eventDate: string;
  eventType: string;
  package: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}