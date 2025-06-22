import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import { useWallet } from './WalletContext';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  register: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { isConnected, publicKey, isAdmin } = useWallet();

  // Auto-create user when wallet is connected
  useEffect(() => {
    if (isConnected && publicKey && !state.user) {
      const user: User = {
        id: publicKey,
        email: `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`,
        publicKey: publicKey,
        isAdmin: isAdmin || false,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
    } else if (!isConnected && state.user) {
      // Clear user when wallet is disconnected
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
    }
  }, [isConnected, publicKey, isAdmin, state.user]);

  const login = async () => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const user = await authAPI.loginWithPasskey();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (_email: string) => {
    // This function seems to be unused, but keeping it for now.
    // It should be removed if not needed.
    console.warn('Register function is not fully implemented against a backend.');
    try {
      dispatch({ type: 'LOGIN_START' });
      // const user = await authAPI.registerWithPasskey(email);
      // dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      // localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  useEffect(() => {
    // Check for existing user on app load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};