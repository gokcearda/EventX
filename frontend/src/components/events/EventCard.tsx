import React from 'react';
import { Calendar, MapPin, Users, Clock, Ticket } from 'lucide-react';
import { Event } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate, formatTime, formatPrice, getEventStatusColor, getTicketAvailabilityColor } from '../../utils/helpers';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onBuyTicket?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onViewDetails, 
  onBuyTicket 
}) => {
  const availabilityPercentage = (event.availableTickets / event.totalTickets) * 100;
  const isSoldOut = event.availableTickets === 0;
  const isCancelled = event.status === 'cancelled';

  return (
    <Card hover className="overflow-hidden">
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {event.category}
          </span>
        </div>
      </div>

      <CardContent>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

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
            <Users className="w-4 h-4 mr-2 text-purple-600" />
            <span className={getTicketAvailabilityColor(event.availableTickets, event.totalTickets)}>
              {event.availableTickets} / {event.totalTickets} tickets available
            </span>
          </div>
        </div>

        {/* Availability Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Ticket Availability</span>
            <span>{Math.round(availabilityPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                availabilityPercentage > 50 
                  ? 'bg-green-500' 
                  : availabilityPercentage > 20 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-2xl font-bold text-purple-600">
          {formatPrice(event.ticketPrice)}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event)}
          >
            View Details
          </Button>
          
          {onBuyTicket && !isCancelled && (
            <Button
              size="sm"
              icon={Ticket}
              onClick={() => onBuyTicket(event)}
              disabled={isSoldOut}
            >
              {isSoldOut ? 'Sold Out' : 'Buy Ticket'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};