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

// Stellar Soroban Network configuration
export const STELLAR_CONFIG = {
  // Network options
  NETWORKS: {
    FUTURENET: {
      name: 'Futurenet',
      horizonUrl: 'https://horizon-futurenet.stellar.org',
      sorobanRpcUrl: 'https://rpc-futurenet.stellar.org',
      networkPassphrase: 'Test SDF Future Network ; October 2022'
    },
    TESTNET: {
      name: 'Testnet',
      horizonUrl: 'https://horizon-testnet.stellar.org',
      sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015'
    },
    PUBLIC: {
      name: 'Public Network',
      horizonUrl: 'https://horizon.stellar.org',
      sorobanRpcUrl: 'https://soroban.stellar.org',
      networkPassphrase: 'Public Global Stellar Network ; September 2015'
    }
  },
  
  // Default network
  DEFAULT_NETWORK: 'FUTURENET',
  
  // Contract address (will be different for each network)
  CONTRACT_ADDRESS: 'CC6NURIYVW6QVHEGEE73AGTJIUQLDB344BSDFETPCJX3ZYJTKYWBGYCH',
  
  // Current network (can be changed by user)
  CURRENT_NETWORK: 'FUTURENET',
  
  // Legacy properties for backward compatibility
  NETWORK_PASSPHRASE: 'Test SDF Future Network ; October 2022',
  HORIZON_URL: 'https://horizon-futurenet.stellar.org',
  SOROBAN_RPC_URL: 'https://rpc-futurenet.stellar.org'
};