import { TripFormData } from '@/types/Trip';
import { useState, useEffect } from 'react';

interface Step3ConnectProps {
  formData: TripFormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Step3Connect({ formData, errors, onInputChange, onImageUpload }: Step3ConnectProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    validateForm();
  }, [formData.meetupLocation, formData.contactInfo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.meetupLocation.trim()) {
      newErrors.meetupLocation = 'Meetup location is required';
    } else if (formData.meetupLocation.trim().length < 3) {
      newErrors.meetupLocation = 'Meetup location must be at least 3 characters';
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onInputChange(e);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect & Share</h2>

      {/* Meetup Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meetup Location *</label>
        <input
          type="text"
          name="meetupLocation"
          value={formData.meetupLocation}
          onChange={handleChangeWithValidation}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            localErrors.meetupLocation ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Airport, Hotel lobby, City center, etc."
        />
        {localErrors.meetupLocation && (
          <p className="mt-1 text-sm text-red-600">{localErrors.meetupLocation}</p>
        )}
      </div>

      {/* Contact Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information *</label>
        <input
          type="text"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChangeWithValidation}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            localErrors.contactInfo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="WhatsApp, Telegram, Email"
        />
        {localErrors.contactInfo && (
          <p className="mt-1 text-sm text-red-600">{localErrors.contactInfo}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trip Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.image && (
          <div className="mt-4">
            <img
              src={formData.image}
              alt="Trip preview"
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-800">Make trip public</h3>
          <p className="text-sm text-gray-600">Allow others to discover and join your trip</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={onInputChange}
            className="sr-only"
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              formData.isPublic ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                formData.isPublic ? 'translate-x-6' : 'translate-x-1'
              } mt-1`}
            />   
          </div>
        </label>
      </div>

      {/* Validation Summary */}
      {Object.keys(localErrors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside text-sm text-red-600">
            {Object.values(localErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}