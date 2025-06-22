import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/events/EventForm';
import { eventAPI } from '../services/api';
import { CreateEventParams } from '../types';
import { useWallet } from '../contexts/WalletContext';
import { AlertCircle, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { isConnected, connectWallet, isConnecting } = useWallet();

  const handleCreateEvent = async (eventData: CreateEventParams) => {
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating event with data:', eventData);
      const result = await eventAPI.createEvent(eventData);
      console.log('Event created successfully:', result);
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create event: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Create New Event
        </h1>
        <p className="text-lg text-gray-600">
          Set up your event with NFT ticketing on the Stellar blockchain
        </p>
      </div>

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-800">
                Wallet Connection Required
              </h3>
            </div>
            <p className="text-yellow-700 mb-4">
              You need to connect your Stellar wallet to create events.
            </p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              icon={Wallet}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <EventForm onSubmit={handleCreateEvent} loading={loading} disabled={!isConnected} />
      </div>
    </div>
  );
};