import { useState, useEffect } from 'react';
import { Ticket } from '../types';
import { ticketAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';

export const useTickets = () => {
  const { isConnected } = useWallet();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!isConnected) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ticketAPI.getUserTickets();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isConnected]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  };
};