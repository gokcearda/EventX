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
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
  ownerId: string;
  ownerAddress?: string;
  tokenId: string;
  qrCode: string;
  isUsed: boolean;
  purchaseDate: string;
  price: number;
  ticketPrice?: number;
  isForSale: boolean;
  resalePrice?: number;
  status?: 'valid' | 'used' | 'cancelled';
  transactionHash?: string;
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
  ticketPrice?: number;
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
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