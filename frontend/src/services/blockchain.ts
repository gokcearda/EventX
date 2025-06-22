// Blockchain service for Stellar/Soroban integration
import { 
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork
} from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '../utils/constants';
import { WalletConnection, PurchaseTicketParams, Event, Ticket } from '../types';

// Contract ABI types
interface CreateEventParams {
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

interface TransferTicketParams {
  ticketId: string;
  toAddress: string;
}

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

class BlockchainService {
  private walletConnection: WalletConnection = {
    isConnected: false,
    publicKey: null,
    balance: 0
  };

  private currentNetwork: string = STELLAR_CONFIG.CURRENT_NETWORK;
  
  // Mock storage for purchased tickets
  private mockTickets: Map<string, Ticket[]> = new Map();
  
  // Mock storage for created events
  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'Blockchain Conference 2024',
      description: 'The biggest blockchain event of the year',
      venue: 'Istanbul, Turkey',
      date: '2024-12-15',
      time: '09:00',
      ticketPrice: 50.0,
      totalTickets: 500,
      availableTickets: 350,
      organizerId: 'organizer_1',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      category: 'Technology',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Web3 Developer Meetup',
      description: 'Connect with fellow developers',
      venue: 'Ankara, Turkey',
      date: '2024-11-20',
      time: '18:00',
      ticketPrice: 25.0,
      totalTickets: 100,
      availableTickets: 25,
      organizerId: 'organizer_2',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
      category: 'Technology',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  constructor() {
    console.log('BlockchainService initialized');
  }

  // Get current network configuration
  private getCurrentNetworkConfig() {
    return STELLAR_CONFIG.NETWORKS[this.currentNetwork as keyof typeof STELLAR_CONFIG.NETWORKS];
  }

  // Set network
  setNetwork(network: string) {
    if (STELLAR_CONFIG.NETWORKS[network as keyof typeof STELLAR_CONFIG.NETWORKS]) {
      this.currentNetwork = network;
      console.log(`Network changed to: ${network}`);
    } else {
      console.error(`Invalid network: ${network}`);
    }
  }

  // Get available networks
  getAvailableNetworks() {
    return Object.keys(STELLAR_CONFIG.NETWORKS).map(key => ({
      key,
      ...STELLAR_CONFIG.NETWORKS[key as keyof typeof STELLAR_CONFIG.NETWORKS]
    }));
  }

  // Check if Freighter is installed and available
  async isFreighterInstalled(): Promise<boolean> {
    try {
      const result = await isConnected();
      return result.isConnected;
    } catch (error) {
      console.error('Error checking if Freighter is installed:', error);
      return false;
    }
  }

  // Check if app is allowed to access Freighter
  async isAppAllowed(): Promise<boolean> {
    try {
      const result = await isAllowed();
      return result.isAllowed;
    } catch (error) {
      console.error('Error checking if app is allowed:', error);
      return false;
    }
  }

  // Request app to be allowed by Freighter
  async requestAppAccess(): Promise<boolean> {
    try {
      const result = await setAllowed();
      return result.isAllowed;
    } catch (error) {
      console.error('Error requesting app access:', error);
      return false;
    }
  }

  // Connect wallet using Freighter (automatic)
  async connectWallet(): Promise<WalletConnection> {
    try {
      console.log('Connecting wallet with Freighter...');

      // Check if Freighter is installed
      const freighterInstalled = await this.isFreighterInstalled();
      if (!freighterInstalled) {
        throw new Error('Freighter wallet is not installed. Please install Freighter extension to connect your wallet.');
      }

      // Check if app is allowed, if not request access
      const appAllowed = await this.isAppAllowed();
      if (!appAllowed) {
        console.log('App not allowed, requesting access...');
        const accessGranted = await this.requestAppAccess();
        if (!accessGranted) {
          throw new Error('App access was denied by user.');
        }
      }

      // Request access to get public key
      const accessResult = await requestAccess();
      if (accessResult.error) {
        throw new Error(`Failed to get public key: ${accessResult.error}`);
      }

      const publicKey = accessResult.address;
      console.log('Public key obtained:', publicKey);

      // Get network information
      const networkResult = await getNetwork();
      if (networkResult.error) {
        console.warn('Could not get network info:', networkResult.error);
      } else {
        console.log('Network:', networkResult.network);
        console.log('Network passphrase:', networkResult.networkPassphrase);
      }

      // Get account balance
      const balance = await this.getAccountBalance(publicKey);
      console.log('Account balance:', balance);

      // Check admin privileges
      const isAdmin = isAdminPublicKey(publicKey);
      console.log('Admin privileges:', isAdmin);

      // Create wallet connection object
      const connection: WalletConnection = {
        isConnected: true,
        publicKey: publicKey,
        balance: balance,
        isManual: false,
        isAdmin: isAdmin
      };

      this.walletConnection = connection;
      console.log('Wallet connected successfully:', connection);

      return connection;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Connect wallet manually with public key
  async connectWalletManually(publicKey: string): Promise<WalletConnection> {
    try {
      console.log('Manual public key:', publicKey);

      // Validate public key format (basic check)
      if (!publicKey.startsWith('G') || publicKey.length !== 56) {
        throw new Error('Invalid public key format. Public key should start with G and be 56 characters long.');
      }

      // Get account balance
      const balance = await this.getAccountBalance(publicKey);
      console.log('Account balance:', balance);

      // Check admin privileges
      const isAdmin = isAdminPublicKey(publicKey);
      console.log('Admin privileges:', isAdmin);

      // Create wallet connection object
      const connection: WalletConnection = {
        isConnected: true,
        publicKey: publicKey,
        balance: balance,
        isManual: true,
        isAdmin: isAdmin
      };

      this.walletConnection = connection;
      console.log('Manual wallet connected successfully:', connection);

      return connection;
    } catch (error) {
      console.error('Failed to connect wallet manually:', error);
      throw error;
    }
  }

  // Get current wallet connection
  getWalletConnection(): WalletConnection {
    return this.walletConnection;
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    this.walletConnection = {
      isConnected: false,
      publicKey: null,
      balance: 0
    };
    console.log('Wallet disconnected');
  }

  // Get account balance from Stellar Horizon API
  async getAccountBalance(publicKey: string): Promise<number> {
    try {
      const response = await fetch(`${this.getCurrentNetworkConfig().horizonUrl}/accounts/${publicKey}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Account not found on this network');
          return 0;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const account = await response.json();
      
      // Find XLM balance
      const xlmBalance = account.balances.find((balance: { asset_type: string; balance: string }) => 
        balance.asset_type === 'native'
      );
      
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Error getting account balance:', error);
      return 0;
    }
  }

  // Refresh wallet connection
  async refreshWalletConnection(): Promise<WalletConnection> {
    if (this.walletConnection.publicKey) {
      const balance = await this.getAccountBalance(this.walletConnection.publicKey);
      this.walletConnection.balance = balance;
    }
    return this.walletConnection;
  }

  // Get all events from the smart contract
  async getEvents(): Promise<Event[]> {
    console.log('Getting events from smart contract...');
    
    try {
      // For now, return mock data since contract integration needs proper setup
      // In a real implementation, this would call the smart contract
      return this.mockEvents;
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error('Failed to get events from blockchain');
    }
  }

  // Create a new event on the blockchain
  async createEvent(eventData: CreateEventParams): Promise<string> {
    console.log('Creating event on blockchain:', eventData);
    console.log('Wallet connection:', this.walletConnection);
    console.log('Is admin?', this.walletConnection.isAdmin);
    
    if (!this.walletConnection.isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!this.walletConnection.isAdmin) {
      throw new Error('Admin privileges required to create events');
    }

    try {
      // In a real implementation, this would:
      // 1. Create a transaction to call the smart contract
      // 2. Sign the transaction with Freighter
      // 3. Submit the transaction to the network
      
      // For now, simulate the transaction
      const eventId = `event_${Date.now()}`;
      console.log(`Event created with ID: ${eventId}`);
      
      // Create new event object
      const newEvent: Event = {
        id: eventId,
        title: eventData.title,
        description: eventData.description,
        venue: eventData.venue,
        date: eventData.date,
        time: eventData.time,
        ticketPrice: eventData.ticketPrice,
        totalTickets: eventData.totalTickets,
        availableTickets: eventData.totalTickets,
        organizerId: this.walletConnection.publicKey || '',
        imageUrl: eventData.imageUrl,
        category: eventData.category,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Add to mock storage
      this.mockEvents.push(newEvent);
      console.log('Event added to mock storage:', newEvent);
      
      return eventId;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event on blockchain');
    }
  }

  // Purchase a ticket for an event
  async purchaseTicket(params: PurchaseTicketParams): Promise<string> {
    console.log('Purchasing ticket:', params);
    
    if (!this.walletConnection.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // In a real implementation, this would:
      // 1. Create a transaction to call the smart contract
      // 2. Include payment for the ticket
      // 3. Sign the transaction with Freighter
      // 4. Submit the transaction to the network
      
      // For now, simulate the transaction
      const ticketId = `ticket_${Date.now()}`;
      console.log(`Ticket purchased with ID: ${ticketId}`);
      
      // Get event information
      const events = await this.getEvents();
      const event = events.find(e => e.id === params.eventId);
      
      // Store the purchased ticket in mock storage
      const newTicket: Ticket = {
        id: ticketId,
        eventId: params.eventId,
        ownerId: this.walletConnection.publicKey || '',
        tokenId: ticketId,
        qrCode: `${ticketId}_qr_code`,
        isUsed: false,
        purchaseDate: new Date().toISOString(),
        price: params.totalPrice,
        isForSale: false,
        event: event
      };
      
      // Add to mock storage
      const userKey = this.walletConnection.publicKey || '';
      const existingTickets = this.mockTickets.get(userKey) || [];
      existingTickets.push(newTicket);
      this.mockTickets.set(userKey, existingTickets);
      
      return ticketId;
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      throw new Error('Failed to purchase ticket');
    }
  }

  // Transfer a ticket to another address
  async transferTicket(params: TransferTicketParams): Promise<void> {
    console.log('Transferring ticket:', params);
    
    if (!this.walletConnection.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // In a real implementation, this would:
      // 1. Create a transaction to call the smart contract
      // 2. Sign the transaction with Freighter
      // 3. Submit the transaction to the network
      
      console.log(`Ticket ${params.ticketId} transferred to ${params.toAddress}`);
    } catch (error) {
      console.error('Error transferring ticket:', error);
      throw new Error('Failed to transfer ticket');
    }
  }

  // Get tickets owned by the connected wallet
  async getMyTickets(): Promise<Ticket[]> {
    console.log('Getting my tickets...');
    
    if (!this.walletConnection.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // Get events to attach to tickets
      const events = await this.getEvents();
      
      // Get existing mock tickets (static data)
      const staticMockTickets: Ticket[] = [
        {
          id: 'ticket_1',
          eventId: '1',
          ownerId: this.walletConnection.publicKey || '',
          tokenId: 'token_1',
          qrCode: 'ticket_1_qr_code_data',
          isUsed: false,
          purchaseDate: '2024-01-01T00:00:00Z',
          price: 50.0,
          isForSale: false,
          event: events.find(e => e.id === '1')
        },
        {
          id: 'ticket_2',
          eventId: '2',
          ownerId: this.walletConnection.publicKey || '',
          tokenId: 'token_2',
          qrCode: 'ticket_2_qr_code_data',
          isUsed: true,
          purchaseDate: '2024-01-01T00:00:00Z',
          price: 25.0,
          isForSale: false,
          event: events.find(e => e.id === '2')
        }
      ];
      
      // Get newly purchased tickets from mock storage
      const userKey = this.walletConnection.publicKey || '';
      const purchasedTickets = this.mockTickets.get(userKey) || [];
      
      // Add event information to purchased tickets
      const purchasedTicketsWithEvents = purchasedTickets.map(ticket => ({
        ...ticket,
        event: events.find(e => e.id === ticket.eventId)
      }));
      
      // Combine static and purchased tickets
      const allTickets = [...staticMockTickets, ...purchasedTicketsWithEvents];
      
      console.log(`Found ${allTickets.length} tickets (${staticMockTickets.length} static + ${purchasedTickets.length} purchased)`);
      
      return allTickets;
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw new Error('Failed to get tickets');
    }
  }

  // Use a ticket (mark as used)
  async useTicket(ticketId: string): Promise<void> {
    console.log('Using ticket:', ticketId);
    
    if (!this.walletConnection.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // In a real implementation, this would:
      // 1. Create a transaction to call the smart contract
      // 2. Sign the transaction with Freighter
      // 3. Submit the transaction to the network
      
      console.log(`Ticket ${ticketId} marked as used`);
    } catch (error) {
      console.error('Error using ticket:', error);
      throw new Error('Failed to use ticket');
    }
  }

  // Check if a ticket is valid
  async isTicketValid(ticketId: string): Promise<boolean> {
    console.log('Checking ticket validity:', ticketId);
    
    try {
      // In a real implementation, this would call the smart contract
      // to verify the ticket's validity
      
      // For now, return true for mock tickets
      return ticketId.startsWith('ticket_');
    } catch (error) {
      console.error('Error checking ticket validity:', error);
      return false;
    }
  }

  // Test Freighter configuration
  async testFreighterConfiguration(): Promise<{
    isInstalled: boolean;
    isConnected: boolean;
    hasAccount: boolean;
    network: string;
    publicKey?: string;
    error?: string;
    accounts?: string[];
  }> {
    try {
      const isInstalled = await this.isFreighterInstalled();
      let isConnected = false;
      let hasAccount = false;
      let network = 'unknown';
      let publicKey: string | undefined;
      let accounts: string[] = [];

      if (isInstalled) {
        try {
          const addressResult = await getAddress();
          if (addressResult && addressResult.address) {
            publicKey = addressResult.address;
            hasAccount = true;
            accounts = [publicKey];
            isConnected = true;
          }
          
          const networkResult = await getNetwork();
          network = networkResult.network || 'unknown';
        } catch (error) {
          console.error('Freighter test error:', error);
        }
      }

      return {
        isInstalled,
        isConnected,
        hasAccount,
        network,
        publicKey,
        accounts
      };
    } catch (error) {
      return {
        isInstalled: false,
        isConnected: false,
        hasAccount: false,
        network: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export default new BlockchainService();