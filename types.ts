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

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  paymentType: 'reservation' | 'downpayment' | 'full' | 'partial';
  paymentMethod: string;
  referenceNumber?: string; // Reference number from payment screenshot
  transactionId?: string;
  paidAt: string;
  paidBy?: string; // Name of person who made payment
  validatedBy?: string; // Admin who validated the payment
  notes?: string;
  createdAt: string;
  updatedAt?: string;
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
  quoteContent?: string; // Custom quote content editable by admin
  status: 'Inquiry' | 'QuoteSent' | 'Confirmed' | 'Cancelled';
  archived?: boolean; // Archive flag
  archivedAt?: string; // Archive timestamp
  archivedBy?: string; // Admin who archived
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
  paymentHistory?: PaymentRecord[]; // Payment records
  lastEditedBy?: string; // Admin who last edited
  lastEditedAt?: string; // Last edit timestamp
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  passwordHash: string; // In production, use proper hashing
  createdAt: string;
  lastLogin?: string;
  permissions?: string[]; // Additional permissions for RBAC
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'unarchive' | 'quote_edit' | 'payment_add';
  entityType: 'booking' | 'quote' | 'payment';
  entityId: string;
  changes?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'passwordHash'>;
  error?: string;
}