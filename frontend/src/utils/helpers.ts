import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

export const formatTime = (timeString: string): string => {
  return format(parseISO(`2000-01-01T${timeString}`), 'h:mm a');
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} XLM`;
};

export const generateQRCode = (ticketId: string, eventId: string): string => {
  // In a real implementation, this would be a cryptographically secure hash
  return `${ticketId}-${eventId}-${Date.now()}`;
};

export const truncateAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-4)}`;
};

export const getEventStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'completed':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getTicketAvailabilityColor = (available: number, total: number): string => {
  const percentage = (available / total) * 100;
  if (percentage > 50) return 'text-green-600';
  if (percentage > 20) return 'text-yellow-600';
  return 'text-red-600';
};