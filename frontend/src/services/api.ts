import { Event, Ticket, User, CreateEventParams, PurchaseTicketParams } from '../types';
import blockchainService from './blockchain';

// Admin public keys - these addresses will have admin privileges
const ADMIN_PUBLIC_KEYS = [
  'GCKUE5RWKYTNJNMOJ64YR3HMIOBAEF4PIY4HH6RRNSHSOS325LXWAGAJ', // Test admin key
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Another test admin key
  'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', // Test admin key 3
  'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', // Test admin key 4
  'GAAFAO6UOHGVD6FWVARCM5XB3MDAK4CX75K6VWT6UGTERALYXO3EZCLU', // Current user's key
];

// Check if a public key has admin privileges
const isAdminPublicKey = (publicKey: string): boolean => {
  return ADMIN_PUBLIC_KEYS.includes(publicKey);
};

export const eventAPI = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    return await blockchainService.getEvents();
  },

  // Get event by ID
  getEvent: async (id: string): Promise<Event | null> => {
    // For now, get all events and find the one with matching ID
    const events = await blockchainService.getEvents();
    return events.find(event => event.id === id) || null;
  },

  // Create new event (admin only)
  createEvent: async (eventData: CreateEventParams): Promise<Event> => {
    const _eventId = await blockchainService.createEvent(eventData);

    // Create event object for frontend
    const newEvent: Event = {
      id: _eventId,
      title: eventData.title,
      description: eventData.description,
      venue: eventData.venue,
      date: eventData.date,
      time: eventData.time,
      ticketPrice: eventData.ticketPrice,
      totalTickets: eventData.totalTickets,
      availableTickets: eventData.totalTickets,
      organizerId: 'current-user-id',
      imageUrl: eventData.imageUrl,
      category: eventData.category,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return newEvent;
  },

  // Cancel event (admin only)
  cancelEvent: async (): Promise<void> => {
    // TODO: Implement cancel event functionality
    console.log('Cancel event functionality not implemented yet');
  }
};

export const ticketAPI = {
  // Get user's tickets
  getUserTickets: async (): Promise<Ticket[]> => {
    return await blockchainService.getMyTickets();
  },

  // Purchase tickets
  purchaseTickets: async (params: PurchaseTicketParams): Promise<Ticket[]> => {
    try {
      const ticketId = await blockchainService.purchaseTicket(params);
      
      // Get current user's public key
      const walletConnection = blockchainService.getWalletConnection();
      if (!walletConnection.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get event information to create complete ticket data
      const events = await blockchainService.getEvents();
      const event = events.find(e => e.id === params.eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }

      // Create complete ticket data
      const completeTicket: Ticket = {
        id: ticketId,
        eventId: params.eventId,
        ownerId: walletConnection.publicKey,
        tokenId: ticketId,
        qrCode: `${ticketId}_qr_code`,
        isUsed: false,
        purchaseDate: new Date().toISOString(),
        price: params.totalPrice,
        isForSale: false,
        event: event // Include full event information
      };

      return [completeTicket];
    } catch (error) {
      console.error('Failed to purchase tickets:', error);
      throw new Error(`Failed to purchase tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Resell ticket
  resellTicket: async (ticketId: string, price: number): Promise<void> => {
    // Note: Resale functionality would need to be implemented in the smart contract
    // For now, we'll just log the action
    console.log(`Reselling ticket ${ticketId} for ${price} XLM`);
  },

  // Check in with QR code
  checkInTicket: async (qrCode: string): Promise<{ success: boolean; ticket?: Ticket }> => {
    // Extract ticket ID from QR code (assuming format: qr_ticketId)
    const ticketId = qrCode.replace('qr_', '');
    
    // Check if ticket is valid
    const isValid = await blockchainService.isTicketValid(ticketId);
    if (!isValid) {
      return { success: false };
    }

    // Use the ticket
    await blockchainService.useTicket(ticketId);

    // Get ticket details
    const tickets = await blockchainService.getMyTickets();
    const ticket = tickets.find((t: Ticket) => t.id === ticketId);

    return { 
      success: true, 
      ticket
    };
  }
};

export const authAPI = {
  // Login with Passkey (independent of wallet connection)
  loginWithPasskey: async (): Promise<User> => {
    try {
      // For now, create a mock user for passkey authentication
      // In a real implementation, this would verify the passkey
      const mockUser: User = {
        id: 'passkey-user-' + Date.now(),
        email: 'user@example.com',
        publicKey: null, // Will be set when wallet is connected
        isAdmin: false,
        createdAt: new Date().toISOString()
      };

      return mockUser;
    } catch (error) {
      console.error('Passkey login failed:', error);
      throw error;
    }
  },

  // Connect wallet separately
  connectWallet: async (): Promise<User> => {
    try {
      const walletConnection = await blockchainService.connectWallet();
      
      // Check if Freighter is not installed
      if (walletConnection.error === 'Freighter not installed') {
        throw new Error('Freighter wallet is not installed. Please install Freighter extension to connect your wallet.');
      }
      
      if (!walletConnection.isConnected || !walletConnection.publicKey) {
        throw new Error('Failed to connect wallet. Please make sure Freighter is unlocked and try again.');
      }

      // Check if user is admin
      const isAdmin = isAdminPublicKey(walletConnection.publicKey);

      // Create user object with Freighter public key
      const user: User = {
        id: walletConnection.publicKey,
        email: `${walletConnection.publicKey.slice(0, 8)}...${walletConnection.publicKey.slice(-8)}`,
        publicKey: walletConnection.publicKey,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString()
      };

      return user;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await blockchainService.disconnectWallet();
    // Also clear any other local session data if needed
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const walletConnection = blockchainService.getWalletConnection();
    
    if (!walletConnection.isConnected || !walletConnection.publicKey) {
      return null;
    }

    // Check if user is admin
    const isAdmin = isAdminPublicKey(walletConnection.publicKey);

    return {
      id: walletConnection.publicKey,
      email: `${walletConnection.publicKey.slice(0, 8)}...${walletConnection.publicKey.slice(-8)}`,
      publicKey: walletConnection.publicKey,
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    };
  }
};