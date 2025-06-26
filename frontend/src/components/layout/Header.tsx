import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, User, LogOut, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { formatPrice, truncateAddress } from '../../utils/helpers';
import { STELLAR_CONFIG } from '../../utils/constants';
import blockchainService from '../../services/blockchain';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { isConnected, publicKey, balance, connectWallet, connectWalletManually, disconnectWallet, isConnecting, isManual, isAdmin } = useWallet();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualPublicKey, setManualPublicKey] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(STELLAR_CONFIG.CURRENT_NETWORK);

  const navigation = [
    { name: 'Events', href: '/events', icon: Ticket },
    { name: 'My Tickets', href: '/my-tickets', icon: Ticket, requiresAuth: true },
    { name: 'Admin', href: '/admin', icon: User, requiresAuth: true, requiresAdmin: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Get available networks from constants
  const availableNetworks = Object.entries(STELLAR_CONFIG.NETWORKS).map(([key, network]) => ({
    key,
    name: network.name,
    horizonUrl: network.horizonUrl,
    sorobanRpcUrl: network.sorobanRpcUrl,
    networkPassphrase: network.networkPassphrase
  }));

  const handleConnectWallet = async () => {
    if (showManualInput && manualPublicKey.trim()) {
      try {
        await connectWalletManually(manualPublicKey.trim());
        setShowManualInput(false);
        setManualPublicKey('');
      } catch (error) {
        console.error('Manual connection failed:', error);
        alert(`Manual connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Wallet connection failed:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('Freighter wallet is not installed')) {
          const choice = confirm(
            'Freighter not detected.\n\n' +
            'Options:\n' +
            '1. Install/reload Freighter\n' +
            '2. Enter public key manually\n\n' +
            'OK = Go to Freighter download page\n' +
            'Cancel = Manual public key entry'
          );
          
          if (choice) {
            window.open('https://www.freighter.app/', '_blank');
          } else {
            setShowManualInput(true);
          }
        } else {
          alert(`Wallet connection failed: ${errorMessage}`);
        }
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    await logout();
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    blockchainService.setNetwork(network);
    // Refresh wallet connection if connected
    if (isConnected && publicKey) {
      connectWalletManually(publicKey);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventX
            </span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-1">
              {navigation
                .filter(item => {
                  if (item.requiresAuth && !isAuthenticated) return false;
                  if (item.requiresAdmin && !(user?.isAdmin || isAdmin)) return false;
                  return true;
                })
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
            </nav>
          )}

          {/* Network Selection */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedNetwork}
              onChange={(e) => handleNetworkChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableNetworks.map((network) => (
                <option key={network.key} value={network.key}>
                  {network.name}
                </option>
              ))}
            </select>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  {/* Wallet Connection */}
                  {isConnected ? (
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatPrice(balance)}
                        </div>
                        <div className="text-gray-500">
                          {truncateAddress(publicKey || '')}
                          {isManual && (
                            <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                              Manuel
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDisconnect}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {showManualInput ? (
                        <input
                          type="text"
                          placeholder="Enter public key..."
                          value={manualPublicKey}
                          onChange={(e) => setManualPublicKey(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <Button
                          onClick={() => setShowManualInput(true)}
                          variant="outline"
                          size="sm"
                        >
                          Manual Connect
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Wallet}
                        onClick={handleConnectWallet}
                        disabled={isConnecting || (showManualInput && !manualPublicKey.trim())}
                      >
                        {isConnecting ? 'Bağlanıyor...' : 'Connect Wallet'}
                      </Button>
                    </div>
                  )}

                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-sm">
                      <div className="font-medium text-gray-900">
                        {user?.email}
                      </div>
                      {(user?.isAdmin || isAdmin) && (
                        <div className="text-purple-600 text-xs font-medium">
                          Admin
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={LogOut}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};