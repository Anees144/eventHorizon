
'use client';

import type { DateRange } from "react-day-picker";
import type { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  interests: string[];
};

export type UserProfile = {
  name: string;
  email: string;
  interests: string[];
  savedEvents?: string[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  richDescription: string;
  imageUrl: string;
  imageHint: string;
  videoUrl?: string;
  category: string;
  date: string | Date | Timestamp;
  location: string;
  organizer: string;
  organizerId: string;
  ticketTiers: TicketTier[];
  latitude: number;
  longitude: number;
  promoCodes: PromoCode[];
  tags?: string[];
  visibility: 'public' | 'private' | 'invite-only';
};

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  type: 'paid' | 'reservation' | 'donation';
};

export type FilterState = {
    category: string;
    location: string;
    date: DateRange | undefined;
    search: string;
    radius: number;
    price: number[];
}

export type PromoCode = {
  code: string;
  discountPercentage: number;
};

export type ForumMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: any;
  senderName?: string;
  senderAvatar?: string;
};

    