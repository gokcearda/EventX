import React, { useState } from 'react';
import { Calendar, MapPin, Clock, QrCode, RefreshCw, DollarSign } from 'lucide-react';
import { Ticket } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { QRCodeDisplay } from '../qr/QRCodeDisplay';
import { formatDate, formatTime, formatPrice, getEventStatusColor } from '../../utils/helpers';

interface TicketCardProps {
  ticket: Ticket;
  onResell: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onResell }) => {
  const [showQR, setShowQR] = useState(false);

  if (!ticket.event) {
    return null;
  }

  const { event } = ticket;
  const isEventCancelled = event.status === 'cancelled';
  const isEventCompleted = event.status === 'completed';
  const canResell = !ticket.isUsed && !isEventCancelled && !isEventCompleted && !ticket.isForSale;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            {ticket.isUsed ? (
              <span className="px-2 py-1 bg-gray-800/80 text-white rounded-full text-xs font-medium">
                Used
              </span>
            ) : ticket.isForSale ? (
              <span className="px-2 py-1 bg-blue-600/80 text-white rounded-full text-xs font-medium">
                For Sale
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-600/80 text-white rounded-full text-xs font-medium">
                Valid
              </span>
            )}
          </div>
        </div>

        <CardContent>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-600" />
              <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-600" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
              <span>{formatPrice(ticket.price)}</span>
            </div>
          </div>

          {ticket.isForSale && ticket.resalePrice && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Listed for sale: {formatPrice(ticket.resalePrice)}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            icon={QrCode}
            onClick={() => setShowQR(true)}
            disabled={ticket.isUsed}
          >
            Show QR
          </Button>

          {canResell && (
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => onResell(ticket)}
            >
              Resell
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Ticket QR Code"
        size="sm"
      >
        <div className="text-center space-y-4">
          <QRCodeDisplay
            value={ticket.qrCode}
            size={200}
          />
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
            <p className="text-sm text-gray-600">
              {formatDate(event.date)} at {formatTime(event.time)}
            </p>
            <p className="text-sm text-gray-600">{event.venue}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Ticket ID: {ticket.id}
            </p>
            <p className="text-xs text-gray-500">
              Token ID: {ticket.tokenId}
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Present this QR code at the event for entry
          </p>
        </div>
      </Modal>
    </>
  );
};