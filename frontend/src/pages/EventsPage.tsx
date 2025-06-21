import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { EventList } from '../components/events/EventList';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useEvents } from '../hooks/useEvents';
import { PurchaseTicketModal } from './PurchaseTicketModal';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const handleBuyTicket = (event: Event) => {
    setSelectedEvent(event);
    setShowPurchase(true);
  };

  const handlePurchaseComplete = () => {
    setShowPurchase(false);
    navigate('/my-tickets');
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Events</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-gray-600">
            Find and purchase NFT tickets for the hottest events near you
          </p>
        </div>

        <EventList
          events={events}
          loading={loading}
          onViewDetails={handleViewDetails}
          onBuyTicket={handleBuyTicket}
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title={selectedEvent.title}
          size="lg"
        >
          <div className="space-y-6">
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedEvent.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Date:</span>
                <p className="text-gray-600">{selectedEvent.date}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Time:</span>
                <p className="text-gray-600">{selectedEvent.time}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Venue:</span>
                <p className="text-gray-600">{selectedEvent.venue}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Category:</span>
                <p className="text-gray-600">{selectedEvent.category}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-2xl font-bold text-purple-600">
                {selectedEvent.ticketPrice} XLM
              </div>
              <Button
                onClick={() => {
                  setShowDetails(false);
                  handleBuyTicket(selectedEvent);
                }}
                disabled={selectedEvent.availableTickets === 0}
              >
                {selectedEvent.availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Purchase Modal */}
      {selectedEvent && (
        <PurchaseTicketModal
          isOpen={showPurchase}
          onClose={() => setShowPurchase(false)}
          event={selectedEvent}
          onSuccess={handlePurchaseComplete}
        />
      )}
    </>
  );
};