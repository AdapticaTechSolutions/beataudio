// Storage utility - Uses in-memory storage by default
// To use Supabase: Import from './supabase-storage' instead
// To use Vercel Postgres: Update functions to use @vercel/postgres

import type { Booking, User } from '../../types';

// Switch to Supabase by uncommenting these lines:
// export * from './supabase-storage';
// Then comment out the in-memory storage below

// In-memory storage for serverless functions
// In production, replace with Vercel Postgres or Supabase
let bookingsStorage: Booking[] = [];
let usersStorage: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@beataudio.ph',
    role: 'admin',
    passwordHash: 'password', // In production, use bcrypt hash
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'staff',
    email: 'staff@beataudio.ph',
    role: 'staff',
    passwordHash: 'password',
    createdAt: new Date().toISOString(),
  },
];

export async function getBookings(): Promise<Booking[]> {
  // In production, fetch from database
  return bookingsStorage;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  return bookingsStorage.find(b => b.id === id) || null;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  const newBooking: Booking = {
    ...booking,
    id: generateBookingId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookingsStorage.push(newBooking);
  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const index = bookingsStorage.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  bookingsStorage[index] = {
    ...bookingsStorage[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return bookingsStorage[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  const index = bookingsStorage.findIndex(b => b.id === id);
  if (index === -1) return false;
  bookingsStorage.splice(index, 1);
  return true;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return usersStorage.find(u => u.username === username) || null;
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  return usersStorage.map(({ passwordHash, ...user }) => user);
}

function generateBookingId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `BA-${year}-${random}`;
}

