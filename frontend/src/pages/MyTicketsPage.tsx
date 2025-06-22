import React, { useState } from 'react';
import { TicketList } from '../components/tickets/TicketList';
import { ResellModal } from '../components/tickets/ResellModal';
import { useTickets } from '../hooks/useTickets';
import { Ticket } from '../types';

export const MyTicketsPage: React.FC = () => {
  const { tickets, loading, refetch } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showResellModal, setShowResellModal] = useState(false);

  // Debug bilgisi
  console.log('MyTicketsPage Debug:', {
    ticketsCount: tickets.length,
    loading,
    tickets: tickets
  });

  const handleResell = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowResellModal(true);
  };

  const handleResellClose = () => {
    setShowResellModal(false);
    setSelectedTicket(null);
  };

  const handleResellSuccess = () => {
    handleResellClose();
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
          <a 
            href="/events" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <TicketList tickets={tickets} loading={loading} onResell={handleResell} />
      )}

      {showResellModal && selectedTicket && (
        <ResellModal
          isOpen={showResellModal}
          onClose={handleResellClose}
          ticket={selectedTicket}
          onConfirm={async (ticketId: string, price: number) => {
            // TODO: Implement resell functionality
            console.log('Reselling ticket:', ticketId, 'for price:', price);
            handleResellSuccess();
          }}
        />
      )}
    </div>
  );
};