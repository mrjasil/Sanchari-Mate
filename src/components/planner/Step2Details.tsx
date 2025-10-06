import { TripFormData } from '@/types/Trip';
import { useState, useEffect } from 'react';

interface Step2DetailsProps {
  formData: TripFormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const difficulties = [
  { value: 'easy', label: '😊 Easy Going', description: 'Relaxed pace, minimal physical activity' },
  { value: 'moderate', label: '🚶 Moderate', description: 'Some walking/hiking, average fitness needed' },
  { value: 'challenging', label: '🥾 Challenging', description: 'Requires good fitness, adventurous activities' },
  { value: 'extreme', label: '🔥 Extreme', description: 'High intensity, experienced travelers only' }
];

export default function Step2Details({ formData, errors, onInputChange }: Step2DetailsProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fieldName = e.target.name;
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trip Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          onBlur={handleBlur}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your amazing trip idea, what makes it special, and what travelers can expect..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        {!errors.description && formData.description && (
          <p className="mt-1 text-sm text-green-600">
            {formData.description.length >= 20 
              ? '✓ Good description length' 
              : `${20 - formData.description.length} more characters needed`}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Type</label>
          <select
            name="accommodation"
            value={formData.accommodation}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select accommodation</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="airbnb">Airbnb</option>
            <option value="camping">Camping</option>
            <option value="resort">Resort</option>
            <option value="guesthouse">Guesthouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transportation</label>
          <select
            name="transportation"
            value={formData.transportation}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select transportation</option>
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="bus">Bus</option>
            <option value="car">Car/Rental</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trip Highlights (comma-separated) *</label>
        <input
          type="text"
          name="highlights"
          value={formData.highlights}
          onChange={onInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.highlights ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Sunrise hike, Local cooking class, Beach hopping, Temple visits"
        />
        {errors.highlights && (
          <p className="mt-1 text-sm text-red-600">{errors.highlights}</p>
        )}
        {formData.highlights && !errors.highlights && (
          <p className="mt-1 text-sm text-gray-500">
            {formData.highlights.split(',').filter(h => h.trim()).length} highlight(s) added
          </p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h3 className="font-medium text-yellow-800 mb-2">Validation Status</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li className={formData.description.length >= 20 ? 'text-green-600' : ''}>
            {formData.description.length >= 20 ? '✓' : '○'} Description (min. 20 characters)
          </li>
          <li className={formData.highlights.split(',').filter(h => h.trim()).length >= 2 ? 'text-green-600' : ''}>
            {formData.highlights.split(',').filter(h => h.trim()).length >= 2 ? '✓' : '○'} At least 2 highlights
          </li>
        </ul>
      </div>
    </div>
  );
}