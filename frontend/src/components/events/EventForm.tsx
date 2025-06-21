import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Users, Image, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { CreateEventParams } from '../../types';
import { EVENT_CATEGORIES } from '../../utils/constants';

interface EventFormProps {
  onSubmit: (eventData: CreateEventParams) => Promise<void>;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<CreateEventParams>({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    ticketPrice: 0,
    totalTickets: 0,
    imageUrl: '',
    category: EVENT_CATEGORIES[0]
  });

  const [errors, setErrors] = useState<Partial<CreateEventParams>>({});

  const handleChange = (field: keyof CreateEventParams, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEventParams> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.ticketPrice <= 0) newErrors.ticketPrice = 'Ticket price must be greater than 0';
    if (formData.totalTickets <= 0) newErrors.totalTickets = 'Total tickets must be greater than 0';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';

    // Validate date is in the future
    if (formData.date) {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'Event date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        venue: '',
        date: '',
        time: '',
        ticketPrice: 0,
        totalTickets: 0,
        imageUrl: '',
        category: EVENT_CATEGORIES[0]
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const categoryOptions = EVENT_CATEGORIES.map(category => ({
    value: category,
    label: category
  }));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
        <p className="text-gray-600">Fill in the details to create your NFT ticketed event</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Event Title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                rows={4}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Venue"
                placeholder="Event location"
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                error={errors.venue}
              />
            </div>

            <div>
              <Input
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Input
                type="time"
                label="Time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                error={errors.time}
              />
            </div>

            <div>
              <Input
                type="number"
                label="Ticket Price (XLM)"
                placeholder="0.00"
                value={formData.ticketPrice}
                onChange={(e) => handleChange('ticketPrice', parseFloat(e.target.value) || 0)}
                error={errors.ticketPrice}
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <Input
                type="number"
                label="Total Tickets"
                placeholder="100"
                value={formData.totalTickets}
                onChange={(e) => handleChange('totalTickets', parseInt(e.target.value) || 0)}
                error={errors.totalTickets}
                min="1"
              />
            </div>

            <div>
              <Select
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                error={errors.imageUrl}
                hint="Use a high-quality image from Pexels or similar"
              />
            </div>
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.imageUrl}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                  onError={() => handleChange('imageUrl', '')}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="min-w-[200px]"
            >
              Create Event
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};