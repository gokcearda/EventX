// Mock blockchain service for Stellar/Soroban integration
// This will be replaced with actual Stellar SDK implementation

import { isConnected, requestAccess, getAddress, getNetwork, getNetworkDetails } from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '../utils/constants';
import { WalletConnection, PurchaseTicketParams } from '../types';

class BlockchainService {
  private walletConnection: WalletConnection = {
    isConnected: false,
    publicKey: null,
    balance: 0
  };

  // Check if Freighter is installed
  async isFreighterInstalled(): Promise<boolean> {
    try {
      console.log('Checking if Freighter is installed...');
      
      // Check if window.freighterApi exists
      if (typeof window !== 'undefined' && (window as { freighterApi?: unknown }).freighterApi) {
        console.log('Freighter API found in window object');
        return true;
      }
      
      // Try to access Freighter API
      await getNetwork();
      console.log('Freighter API accessible');
      return true;
    } catch (error) {
      console.log('Freighter not installed or not accessible:', error);
      return false;
    }
  }

  // Connect to Freighter wallet
  async connectWallet(): Promise<WalletConnection> {
    try {
      console.log('Starting wallet connection...');
      
      // Check if Freighter is installed
      const isInstalled = await this.isFreighterInstalled();
      console.log('Freighter installed:', isInstalled);
      
      if (!isInstalled) {
        // If Freighter is not installed, offer manual input
        const manualPublicKey = prompt('Freighter yüklü değil. Lütfen public key\'inizi manuel olarak girin (GCKUE5RWKYTNJNMOJ64YR3HMIOBAEF4PIY4HH6RRNSHSOS325LXWAGAJ):');
        
        if (manualPublicKey && manualPublicKey.trim() !== '') {
          const publicKey = manualPublicKey.trim();
          console.log('Using manual public key:', publicKey);
          
          // Get account balance
          const balance = await this.getAccountBalance(publicKey);
          
          this.walletConnection = {
            isConnected: true,
            publicKey,
            balance
          };
          
          return this.walletConnection;
        } else {
          throw new Error('Public key gerekli. Lütfen geçerli bir Stellar public key girin.');
        }
      }

      // Try to get public key from Freighter
      let publicKey: string | undefined;
      
      try {
        // Check if already connected
        const connected = await isConnected();
        console.log('Already connected:', connected);
        
        if (!connected) {
          console.log('Requesting access to Freighter...');
          await requestAccess();
          console.log('Access granted');
        }

        // Try to get public key with delay
        console.log('Getting public key from Freighter...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const addressResult = await getAddress();
        console.log('Address result:', addressResult);
        
        if (addressResult && addressResult.address && addressResult.address.trim() !== '') {
          publicKey = addressResult.address.trim();
          console.log('Public key from Freighter:', publicKey);
        }
      } catch (freighterError) {
        console.error('Freighter API error:', freighterError);
      }

      // If Freighter didn't work, offer manual input
      if (!publicKey) {
        const manualPublicKey = prompt('Freighter API çalışmıyor. Lütfen public key\'inizi manuel olarak girin (GCKUE5RWKYTNJNMOJ64YR3HMIOBAEF4PIY4HH6RRNSHSOS325LXWAGAJ):');
        
        if (manualPublicKey && manualPublicKey.trim() !== '') {
          publicKey = manualPublicKey.trim();
          console.log('Using manual public key:', publicKey);
        } else {
          throw new Error('Public key gerekli. Lütfen geçerli bir Stellar public key girin.');
        }
      }

      // Get account balance
      console.log('Getting account balance...');
      const balance = await this.getAccountBalance(publicKey);
      console.log('Balance:', balance);

      // Update wallet connection
      this.walletConnection = {
        isConnected: true,
        publicKey,
        balance
      };

      console.log('Wallet connection successful:', this.walletConnection);
      return this.walletConnection;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    this.walletConnection = {
      isConnected: false,
      publicKey: null,
      balance: 0
    };
  }

  // Get wallet connection status
  getWalletConnection(): WalletConnection {
    return this.walletConnection;
  }

  // Get account balance from Horizon Testnet
  async getAccountBalance(publicKey: string): Promise<number> {
    try {
      const response = await fetch(`${STELLAR_CONFIG.HORIZON_URL}/accounts/${publicKey}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Account doesn't exist yet, return 0 balance
          return 0;
        }
        throw new Error(`Failed to fetch account balance: ${response.statusText}`);
      }

      const accountData = await response.json();
      
      // Find XLM balance
      const xlmBalance = accountData.balances.find((balance: { asset_type: string; balance: string }) => 
        balance.asset_type === 'native'
      );

      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return 0;
    }
  }

  // Refresh wallet connection and balance
  async refreshWalletConnection(): Promise<WalletConnection> {
    if (this.walletConnection.isConnected && this.walletConnection.publicKey) {
      const balance = await this.getAccountBalance(this.walletConnection.publicKey);
      this.walletConnection.balance = balance;
    }
    return this.walletConnection;
  }

  // Purchase tickets via smart contract
  async purchaseTicketsOnChain(params: PurchaseTicketParams): Promise<{
    success: boolean;
    transactionHash?: string;
    tokenIds?: string[];
  }> {
    try {
      if (!this.walletConnection.isConnected || !this.walletConnection.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Check if user has enough balance
      if (this.walletConnection.balance < params.totalPrice) {
        throw new Error('Insufficient balance');
      }

      // TODO: Implement actual Soroban contract call here
      // For now, simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tokenIds = Array.from({ length: params.quantity }, (_, i) => 
        `TOKEN_${Date.now()}_${i}`
      );

      // Update balance after purchase
      this.walletConnection.balance -= params.totalPrice;

      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substring(2),
        tokenIds
      };
    } catch (error) {
      console.error('Failed to purchase tickets:', error);
      throw error;
    }
  }

  // Transfer NFT ticket to another address
  async transferTicket(): Promise<{
    success: boolean;
    transactionHash?: string;
  }> {
    try {
      if (!this.walletConnection.isConnected || !this.walletConnection.publicKey) {
        throw new Error('Wallet not connected');
      }

      // TODO: Implement actual Soroban contract call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substring(2)
      };
    } catch (error) {
      console.error('Failed to transfer ticket:', error);
      throw error;
    }
  }

  // Cancel event and process refunds
  async cancelEventAndRefund(): Promise<{
    success: boolean;
    transactionHash?: string;
    refundsProcessed?: number;
  }> {
    try {
      if (!this.walletConnection.isConnected || !this.walletConnection.publicKey) {
        throw new Error('Wallet not connected');
      }

      // TODO: Implement actual Soroban contract call here
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substring(2),
        refundsProcessed: 158
      };
    } catch (error) {
      console.error('Failed to cancel event:', error);
      throw error;
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
      console.log('Testing Freighter configuration...');
      
      // Check if installed
      const isInstalled = await this.isFreighterInstalled();
      console.log('Freighter installed:', isInstalled);
      
      if (!isInstalled) {
        return {
          isInstalled: false,
          isConnected: false,
          hasAccount: false,
          network: 'unknown',
          error: 'Freighter is not installed'
        };
      }

      // Check connection
      const connected = await isConnected();
      console.log('Freighter connected:', connected);
      
      if (!connected) {
        return {
          isInstalled: true,
          isConnected: false,
          hasAccount: false,
          network: 'unknown',
          error: 'Freighter is not connected'
        };
      }

      // Get network
      const networkDetails = await getNetworkDetails();
      console.log('Network details:', networkDetails);
      
      // Try to get public key
      let publicKey: string | undefined;
      let accounts: string[] = [];
      
      try {
        const addressResult = await getAddress();
        publicKey = addressResult?.address;
        console.log('Public key:', publicKey);
        
        // Check if address is empty
        if (!publicKey || publicKey.trim() === '') {
          console.log('Empty address received from Freighter');
          publicKey = undefined;
        }
        
        // Try to get all accounts (if possible)
        try {
          // This might not work with all Freighter versions, but worth trying
          if (typeof window !== 'undefined' && (window as { freighterApi?: { getAccounts?: () => Promise<Array<{ publicKey?: string; address?: string }>> } }).freighterApi) {
            const freighterApi = (window as { freighterApi?: { getAccounts?: () => Promise<Array<{ publicKey?: string; address?: string }>> } }).freighterApi;
            if (freighterApi?.getAccounts) {
              const allAccounts = await freighterApi.getAccounts();
              accounts = allAccounts.map((acc) => acc.publicKey || acc.address || 'Unknown');
              console.log('All accounts:', accounts);
            }
          }
        } catch (accountsError) {
          console.log('Could not get all accounts:', accountsError);
        }
        
      } catch (error) {
        console.error('Error getting public key:', error);
      }

      return {
        isInstalled: true,
        isConnected: true,
        hasAccount: !!publicKey,
        network: networkDetails.network,
        publicKey,
        accounts: accounts.length > 0 ? accounts : undefined,
        error: !publicKey ? 'No account found in Freighter' : undefined
      };
    } catch (error) {
      console.error('Error testing Freighter configuration:', error);
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

export const blockchainService = new BlockchainService();