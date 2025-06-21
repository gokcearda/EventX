import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Ticket } from '../../types';
import { formatPrice } from '../../utils/helpers';

interface ResellModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onConfirm: (ticketId: string, price: number) => Promise<void>;
}

export const ResellModal: React.FC<ResellModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onConfirm
}) => {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticket) return;

    const resalePrice = parseFloat(price);
    
    if (isNaN(resalePrice) || resalePrice <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (resalePrice < ticket.price * 0.1) {
      setError('Price must be at least 10% of original price');
      return;
    }

    if (resalePrice > ticket.price * 3) {
      setError('Price cannot exceed 300% of original price');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onConfirm(ticket.id, resalePrice);
      setPrice('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list ticket for sale');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPrice('');
    setError('');
    onClose();
  };

  if (!ticket || !ticket.event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Resell Ticket"
      size="md"
    >
      <div className="space-y-6">
        {/* Ticket Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{ticket.event.title}</h4>
          <p className="text-sm text-gray-600">
            Original price: {formatPrice(ticket.price)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            label="Resale Price (XLM)"
            placeholder="Enter your asking price"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setError('');
            }}
            error={error}
            step="0.01"
            min="0"
            hint={`Recommended range: ${formatPrice(ticket.price * 0.8)} - ${formatPrice(ticket.price * 1.2)}`}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">Resale Terms</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Minimum price: 10% of original ticket price</li>
              <li>• Maximum price: 300% of original ticket price</li>
              <li>• 5% platform fee will be deducted from sale</li>
              <li>• Sale is final once a buyer is found</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={DollarSign}
            >
              List for Sale
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};