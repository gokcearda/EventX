import { Event, Ticket, User, CreateEventParams, PurchaseTicketParams } from '../types';
import { blockchainService } from './blockchain';

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Stellar Conference 2024',
    description: 'The biggest blockchain conference of the year featuring top speakers from the Stellar ecosystem.',
    venue: 'Convention Center, San Francisco',
    date: '2024-03-15',
    time: '09:00',
    ticketPrice: 50,
    totalTickets: 500,
    availableTickets: 342,
    organizerId: 'org1',
    imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    category: 'Technology',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'NFT Art Gallery Opening',
    description: 'Exclusive opening of the first NFT art gallery featuring works from renowned digital artists.',
    venue: 'Modern Art Museum, New York',
    date: '2024-03-20',
    time: '18:00',
    ticketPrice: 25,
    totalTickets: 200,
    availableTickets: 0,
    organizerId: 'org2',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    category: 'Art',
    status: 'active',
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: '3',
    title: 'DeFi Summit Miami',
    description: 'Bringing together the brightest minds in decentralized finance for two days of networking and learning.',
    venue: 'Miami Beach Convention Center',
    date: '2024-04-10',
    time: '08:00',
    ticketPrice: 75,
    totalTickets: 1000,
    availableTickets: 756,
    organizerId: 'org3',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    category: 'Business',
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z'
  }
];

const mockTickets: Ticket[] = [
  {
    id: 'ticket1',
    eventId: '1',
    ownerId: 'user1',
    tokenId: 'token123',
    qrCode: 'ticket1-1-1708123456789',
    isUsed: false,
    purchaseDate: '2024-02-10T15:30:00Z',
    price: 50,
    isForSale: false
  }
];

export const eventAPI = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  },

  // Get event by ID
  getEvent: async (id: string): Promise<Event | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvents.find(event => event.id === id) || null;
  },

  // Create new event (admin only)
  createEvent: async (eventData: CreateEventParams): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
      availableTickets: eventData.totalTickets,
      organizerId: 'current-user-id',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  // Cancel event (admin only)
  cancelEvent: async (eventId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      event.status = 'cancelled';
    }
  }
};

export const ticketAPI = {
  // Get user's tickets
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTickets.filter(ticket => ticket.ownerId === userId).map(ticket => ({
      ...ticket,
      event: mockEvents.find(event => event.id === ticket.eventId)
    }));
  },

  // Purchase tickets
  purchaseTickets: async (params: PurchaseTicketParams): Promise<Ticket[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const event = mockEvents.find(e => e.id === params.eventId);
    if (!event || event.availableTickets < params.quantity) {
      throw new Error('Not enough tickets available');
    }

    const newTickets: Ticket[] = [];
    for (let i = 0; i < params.quantity; i++) {
      const ticket: Ticket = {
        id: `ticket${Date.now()}-${i}`,
        eventId: params.eventId,
        ownerId: 'current-user-id',
        tokenId: `token${Date.now()}-${i}`,
        qrCode: `ticket${Date.now()}-${i}-${params.eventId}-${Date.now()}`,
        isUsed: false,
        purchaseDate: new Date().toISOString(),
        price: params.totalPrice / params.quantity,
        isForSale: false,
        event
      };
      newTickets.push(ticket);
      mockTickets.push(ticket);
    }

    event.availableTickets -= params.quantity;
    return newTickets;
  },

  // Resell ticket
  resellTicket: async (ticketId: string, price: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.isForSale = true;
      ticket.resalePrice = price;
    }
  },

  // Check in with QR code
  checkInTicket: async (qrCode: string): Promise<{ success: boolean; ticket?: Ticket }> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const ticket = mockTickets.find(t => t.qrCode === qrCode);
    
    if (!ticket) {
      return { success: false };
    }

    if (ticket.isUsed) {
      throw new Error('Ticket already used');
    }

    ticket.isUsed = true;
    return { 
      success: true, 
      ticket: {
        ...ticket,
        event: mockEvents.find(e => e.id === ticket.eventId)
      }
    };
  }
};

export const authAPI = {
  // Login with Freighter wallet
  loginWithPasskey: async (): Promise<User> => {
    try {
      // Connect to Freighter wallet
      const walletConnection = await blockchainService.connectWallet();
      
      if (!walletConnection.isConnected || !walletConnection.publicKey) {
        throw new Error('Failed to connect wallet');
      }

      // Create user object with Freighter public key
      const user: User = {
        id: walletConnection.publicKey,
        email: `${walletConnection.publicKey.slice(0, 8)}...${walletConnection.publicKey.slice(-8)}`,
        publicKey: walletConnection.publicKey,
        isAdmin: false, // TODO: Check if user is admin based on public key
        createdAt: new Date().toISOString()
      };

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Register with Freighter wallet
  registerWithPasskey: async (email: string): Promise<User> => {
    try {
      // Connect to Freighter wallet
      const walletConnection = await blockchainService.connectWallet();
      
      if (!walletConnection.isConnected || !walletConnection.publicKey) {
        throw new Error('Failed to connect wallet');
      }

      // Create user object with Freighter public key
      const user: User = {
        id: walletConnection.publicKey,
        email: email || `${walletConnection.publicKey.slice(0, 8)}...${walletConnection.publicKey.slice(-8)}`,
        publicKey: walletConnection.publicKey,
        isAdmin: false, // TODO: Check if user is admin based on public key
        createdAt: new Date().toISOString()
      };

      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
};