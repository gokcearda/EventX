export interface User {
  id: string;
  email: string;
  publicKey: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  ticketPrice: number;
  totalTickets: number;
  availableTickets: number;
  organizerId: string;
  imageUrl: string;
  category: string;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  ownerId: string;
  tokenId: string;
  qrCode: string;
  isUsed: boolean;
  purchaseDate: string;
  price: number;
  isForSale: boolean;
  resalePrice?: number;
  event?: Event;
}

export interface WalletConnection {
  isConnected: boolean;
  publicKey: string | null;
  balance: number;
  error?: string;
  isManual?: boolean;
  isAdmin?: boolean;
}

export interface PurchaseTicketParams {
  eventId: string;
  quantity: number;
  totalPrice: number;
}

export interface CreateEventParams {
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  ticketPrice: number;
  totalTickets: number;
  imageUrl: string;
  category: string;
}