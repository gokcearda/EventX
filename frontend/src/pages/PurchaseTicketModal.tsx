import React, { useState } from 'react';
import { Ticket, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Event } from '../types';
import { useWallet } from '../contexts/WalletContext';
import { ticketAPI } from '../services/api';
import { blockchainService } from '../services/blockchain';
import { formatPrice } from '../utils/helpers';

interface PurchaseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
}

export const PurchaseTicketModal: React.FC<PurchaseTicketModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess
}) => {
  const { isConnected, connectWallet, balance } = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = event.ticketPrice * quantity;
  const canAfford = balance >= totalPrice;
  const hasEnoughTickets = event.availableTickets >= quantity;

  const handlePurchase = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!canAfford) {
      setError('Insufficient balance');
      return;
    }

    if (!hasEnoughTickets) {
      setError('Not enough tickets available');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // First, process the blockchain transaction
      const blockchainResult = await blockchainService.purchaseTicketsOnChain({
        eventId: event.id,
        quantity,
        totalPrice
      });

      if (!blockchainResult.success) {
        throw new Error('Blockchain transaction failed');
      }

      // Then, record the purchase in our API
      await ticketAPI.purchaseTickets({
        eventId: event.id,
        quantity,
        totalPrice
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Purchase Tickets"
      size="md"
    >
      <div className="space-y-6">
        {/* Event Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
          <p className="text-sm text-gray-600">{event.venue}</p>
          <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
        </div>

        {/* Wallet Status */}
        {!isConnected ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">Wallet Not Connected</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Connect your Stellar wallet to purchase tickets
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={connectWallet}
              className="mt-3"
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Wallet Connected</span>
              </div>
              <span className="text-green-700 font-medium">
                {formatPrice(balance)}
              </span>
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div>
          <Input
            type="number"
            label="Number of Tickets"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={event.availableTickets}
            hint={`${event.availableTickets} tickets available`}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>Price per ticket:</span>
            <span>{formatPrice(event.ticketPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{quantity}</span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-purple-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Warnings */}
        {!canAfford && isConnected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Insufficient Balance</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              You need {formatPrice(totalPrice - balance)} more XLM to complete this purchase
            </p>
          </div>
        )}

        {!hasEnoughTickets && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Limited Availability</span>
            </div>
            <p className="text-orange-700 text-sm mt-1">
              Only {event.availableTickets} tickets remaining
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* NFT Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 mb-2">NFT Ticket Benefits</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Unique NFT on Stellar blockchain</li>
            <li>• Fraud-proof and transferable</li>
            <li>• QR code for easy check-in</li>
            <li>• Resale marketplace access</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            loading={loading}
            disabled={!isConnected || !canAfford || !hasEnoughTickets}
            icon={CreditCard}
          >
            Purchase {quantity} Ticket{quantity > 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
};