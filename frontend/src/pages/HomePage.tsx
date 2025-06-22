import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { Ticket, Plus, User, Scan, Wallet, Key } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { isConnected, publicKey, balance, connectWallet, connectWalletManually, disconnectWallet, isConnecting, isManual, isAdmin } = useWallet();
  const [manualPublicKey, setManualPublicKey] = useState('');
  const [isConnectingManually, setIsConnectingManually] = useState(false);

  const handleManualConnect = async () => {
    if (!manualPublicKey.trim()) {
      alert('Please enter a public key.');
      return;
    }

    setIsConnectingManually(true);
    try {
      await connectWalletManually(manualPublicKey.trim());
      setManualPublicKey('');
      alert('Manual connection successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Manual connection failed: ${errorMessage}`);
    } finally {
      setIsConnectingManually(false);
    }
  };

  const handleAutoConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Automatic connection failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Ticket className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to EventX
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Blockchain-powered event management platform. Secure, transparent, and user-friendly.
          </p>
          
          {/* Wallet Connection Status */}
          <div className="mb-8">
            {isConnected ? (
              <div className="inline-flex items-center space-x-4 bg-white rounded-lg p-4 shadow-md">
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Balance: {balance.toFixed(2)} XLM
                  </div>
                  <div className="text-sm text-gray-500">
                    {publicKey}
                    {isManual && (
                      <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        Manual
                      </span>
                    )}
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
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    icon={Wallet}
                    onClick={handleAutoConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect with Freighter'}
                  </Button>
                </div>
                
                {/* Manual Connection Section */}
                <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Manual Connection
                  </h3>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Public Key (G followed by 56 characters)"
                      value={manualPublicKey}
                      onChange={(e) => setManualPublicKey(e.target.value)}
                      className="w-full"
                    />
                    <Button
                      variant="outline"
                      onClick={handleManualConnect}
                      disabled={isConnectingManually || !manualPublicKey.trim()}
                      className="w-full"
                    >
                      {isConnectingManually ? 'Connecting...' : 'Connect Manually'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    If Freighter is not installed or you're having issues, you can enter your public key manually.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        {isAuthenticated && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Link to="/events" className="block">
                <Ticket className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Events</h3>
                <p className="text-gray-600">Browse available events and purchase tickets</p>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Link to="/my-tickets" className="block">
                <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Tickets</h3>
                <p className="text-gray-600">Manage your purchased tickets and transfer them</p>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Link to="/create-event" className="block">
                <Plus className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Event</h3>
                <p className="text-gray-600">Create your own event and sell tickets</p>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Link to="/check-in" className="block">
                <Scan className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in</h3>
                <p className="text-gray-600">Scan QR codes for ticket verification</p>
              </Link>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sign in to get started
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to your account to access all EventX features.
              </p>
              <Link to="/login">
                <Button size="lg">
                  Sign In
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Admin Info */}
        {isAuthenticated && !isAdmin && !user?.isAdmin && (
          <div className="text-center">
            <Card className="max-w-4xl mx-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Test Admin Privileges
              </h2>
              <p className="text-gray-600 mb-6">
                To access admin pages, use one of the following test public keys:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium text-gray-700">Test Admin Public Keys:</p>
                <div className="text-xs font-mono text-gray-600 space-y-1">
                  <div>• GCKUE5RWKYTNJNMOJ64YR3HMIOBAEF4PIY4HH6RRNSHSOS325LXWAGAJ</div>
                  <div>• GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</div>
                  <div>• GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB</div>
                  <div>• GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Use one of these keys with manual connection to get admin privileges.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};