import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WalletConnection } from '../types';
import { blockchainService } from '../services/blockchain';

interface WalletState extends WalletConnection {
  isConnecting: boolean;
}

type WalletAction = 
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; payload: WalletConnection }
  | { type: 'CONNECT_FAILURE' }
  | { type: 'DISCONNECT' }
  | { type: 'UPDATE_BALANCE'; payload: number };

const initialState: WalletState = {
  isConnected: false,
  publicKey: null,
  balance: 0,
  isConnecting: false,
};

const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, isConnecting: true };
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isConnecting: false,
      };
    case 'CONNECT_FAILURE':
      return {
        ...initialState,
        isConnecting: false,
      };
    case 'DISCONNECT':
      return initialState;
    case 'UPDATE_BALANCE':
      return { ...state, balance: action.payload };
    default:
      return state;
  }
};

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const connectWallet = async () => {
    try {
      dispatch({ type: 'CONNECT_START' });
      const connection = await blockchainService.connectWallet();
      dispatch({ type: 'CONNECT_SUCCESS', payload: connection });
    } catch (error) {
      dispatch({ type: 'CONNECT_FAILURE' });
      throw error;
    }
  };

  const disconnectWallet = async () => {
    await blockchainService.disconnectWallet();
    dispatch({ type: 'DISCONNECT' });
  };

  const refreshBalance = async () => {
    if (state.publicKey) {
      try {
        const balance = await blockchainService.getAccountBalance(state.publicKey);
        dispatch({ type: 'UPDATE_BALANCE', payload: balance });
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
    }
  };

  useEffect(() => {
    // Check for existing wallet connection on app load
    const connection = blockchainService.getWalletConnection();
    if (connection.isConnected) {
      dispatch({ type: 'CONNECT_SUCCESS', payload: connection });
    }
  }, []);

  const value: WalletContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};