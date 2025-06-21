import React, { useState } from 'react';
import { AlertTriangle, DollarSign, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useEvents } from '../hooks/useEvents';
import { eventAPI } from '../services/api';
import { blockchainService } from '../services/blockchain';
import { Event } from '../types';
import { formatPrice, formatDate, getEventStatusColor } from '../utils/helpers';

export const AdminPage: React.FC = () => {
  const { events, loading, refetch } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelEvent = async () => {
    if (!selectedEvent) return;

    setCancelLoading(true);
    try {
      // Cancel on blockchain and process refunds
      await blockchainService.cancelEventAndRefund(selectedEvent.id);
      
      // Update event status in API
      await eventAPI.cancelEvent(selectedEvent.id);
      
      // Refresh events list
      await refetch();
      
      setShowCancelModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to cancel event:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const activeEvents = events.filter(event => event.status === 'active');
  const totalRevenue = events.reduce((sum, event) => 
    sum + (event.totalTickets - event.availableTickets) * event.ticketPrice, 0
  );
  const totalTicketsSold = events.reduce((sum, event) => 
    sum + (event.totalTickets - event.availableTickets), 0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage events and monitor platform performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTicketsSold.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeEvents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Event Management</h2>
            <p className="text-gray-600">Monitor and manage all events</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tickets</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => {
                    const ticketsSold = event.totalTickets - event.availableTickets;
                    const revenue = ticketsSold * event.ticketPrice;
                    
                    return (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.venue}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(event.date)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {ticketsSold} / {event.totalTickets}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatPrice(revenue)}
                        </td>
                        <td className="py-4 px-4">
                          {event.status === 'active' && (
                            <Button
                              variant="danger"
                              size="sm"
                              icon={AlertTriangle}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowCancelModal(true);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Event Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Event"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Warning: This action cannot be undone</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600">{selectedEvent.venue}</p>
                <p className="text-sm text-gray-600">{formatDate(selectedEvent.date)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Refund Information</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  • All ticket holders will receive automatic refunds
                </p>
                <p className="text-yellow-800 text-sm">
                  • Refunds will be processed on the blockchain
                </p>
                <p className="text-yellow-800 text-sm">
                  • This process may take a few minutes to complete
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Event
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelEvent}
                loading={cancelLoading}
                icon={AlertTriangle}
              >
                Cancel Event & Process Refunds
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};