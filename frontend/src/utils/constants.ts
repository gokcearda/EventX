export const API_BASE_URL = 'http://localhost:3001/api';

export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Technology',
  'Art',
  'Food',
  'Business',
  'Entertainment',
  'Education',
  'Other'
];

export const TICKET_STATUS = {
  AVAILABLE: 'available',
  SOLD_OUT: 'sold_out',
  CANCELLED: 'cancelled'
} as const;

export const EVENT_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Mock Stellar network configuration
export const STELLAR_CONFIG = {
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  CONTRACT_ADDRESS: 'CBQHNAXSI55GX2GN6D67GK7BHVPSLJUGZQEU7WJ5LKR5PNUCGLIMAO4K'
};