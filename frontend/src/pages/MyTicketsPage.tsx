import React, { useState } from 'react';
import { TicketList } from '../components/tickets/TicketList';
import { ResellModal } from '../components/tickets/ResellModal';
import { useTickets } from '../hooks/useTickets';
import { ticketAPI } from '../services/api';
import { Ticket } from '../types';

export const MyTicketsPage: React.FC = () => {
  const { tickets, loading, refetch } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showResellModal, setShowResellModal] = useState(false);

  const handleResell = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowResellModal(true);
  };

  const handleResellConfirm = async (ticketId: string, price: number) => {
    try {
      await ticketAPI.resellTicket(ticketId, price);
      await refetch();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            My Tickets
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your NFT event tickets
          </p>
        </div>

        <TicketList
          tickets={tickets}
          loading={loading}
          onResell={handleResell}
        />
      </div>

      <ResellModal
        isOpen={showResellModal}
        onClose={() => setShowResellModal(false)}
        ticket={selectedTicket}
        onConfirm={handleResellConfirm}
      />
    </>
  );
};