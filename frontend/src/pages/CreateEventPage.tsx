import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/events/EventForm';
import { eventAPI } from '../services/api';
import { CreateEventParams } from '../types';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleCreateEvent = async (eventData: CreateEventParams) => {
    setLoading(true);
    try {
      await eventAPI.createEvent(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
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

      <div className="max-w-4xl mx-auto">
        <EventForm onSubmit={handleCreateEvent} loading={loading} />
      </div>
    </div>
  );
};