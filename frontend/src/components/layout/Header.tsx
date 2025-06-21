import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Plus, User, LogOut, Wallet, Scan } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { formatPrice, truncateAddress } from '../../utils/helpers';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { isConnected, publicKey, balance, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const navigation = [
    { name: 'Events', href: '/events', icon: Ticket },
    { name: 'My Tickets', href: '/my-tickets', icon: User },
    ...(user?.isAdmin ? [{ name: 'Create Event', href: '/create-event', icon: Plus }] : []),
    ...(user?.isAdmin ? [{ name: 'Check-in', href: '/check-in', icon: Scan }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleConnectWallet = async () => {
    try {
      console.log('Connecting wallet...');
      await connectWallet();
      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Cüzdan bağlantısı başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
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
              {navigation.map((item) => {
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
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disconnectWallet}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Wallet}
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Bağlanıyor...' : 'Connect Wallet'}
                  </Button>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-sm">
                    <div className="font-medium text-gray-900">
                      {user?.email}
                    </div>
                    {user?.isAdmin && (
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
    </header>
  );
};