export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  interests: string[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  richDescription: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  date: string;
  location: string;
  organizer: string;
  organizerId: string;
  ticketTiers: TicketTier[];
};

export type TicketTier = {
  id: string;
  name: string;
  price: number;
};

export type FilterState = {
    category: string;
    location: string;
    date: Date | null;
    search: string;
}
