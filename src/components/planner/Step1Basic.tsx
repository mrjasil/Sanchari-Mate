import { TripFormData } from '@/types/Trip';
import ImageUploadField from '@/components/ui/ImageUploadField';

interface Step1BasicProps {
  formData: TripFormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { value: 'adventure', label: '🏔️ Adventure', color: 'bg-orange-100 text-orange-800' },
  { value: 'cultural', label: '🏛️ Cultural', color: 'bg-purple-100 text-purple-800' },
  { value: 'beach', label: '🏖️ Beach', color: 'bg-blue-100 text-blue-800' },
  { value: 'city', label: '🏙️ City Break', color: 'bg-gray-100 text-gray-800' },
  { value: 'nature', label: '🌿 Nature', color: 'bg-green-100 text-green-800' },
  { value: 'food', label: '🍜 Food Tour', color: 'bg-red-100 text-red-800' },
  { value: 'photography', label: '📸 Photography', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'wellness', label: '🧘 Wellness', color: 'bg-pink-100 text-pink-800' }
];

export default function Step1Basic({ formData, errors, onInputChange, onCategorySelect }: Step1BasicProps) {
  const selectedCategories = typeof formData.category === 'string' 
    ? formData.category.split(',').filter(c => c !== '')
    : [];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Basic Trip Information</h2>
        <p className="text-gray-600 mt-2">Tell us about your amazing trip idea</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Epic Bali Adventure 2024"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={onInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Bali, Indonesia"
          />
          {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination}</p>}
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers *</label>
          <input
            type="number"
            name="travelers"
            value={formData.travelers}
            onChange={onInputChange}
            min="1"
            max="20"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.travelers ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">How many people can join this trip?</p>
          {errors.travelers && <p className="mt-1 text-sm text-red-600">{errors.travelers}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onInputChange}
            min={today}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onInputChange}
            min={formData.startDate || today}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>

        {/* Budget */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget (per person) - ₹</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={onInputChange}
            min="0"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="15000"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty if budget is flexible</p>
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What type of trip is this? (Select one or more) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onCategorySelect(category.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${errors.category ? 'border-red-200' : ''}`}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
        <p className="text-xs text-gray-500 mt-2">
          Selected: {selectedCategories.length > 0 ? selectedCategories.map(cat => 
            categories.find(c => c.value === cat)?.label.replace(/[^a-zA-Z\s]/g, '')
          ).join(', ') : 'None'}
        </p>
      </div>

      {/* Trip Cover Image */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Trip Cover Image</label>
        <ImageUploadField
          value={formData.image}
          onChange={(value) => onInputChange({ target: { name: 'image', value: value } } as React.ChangeEvent<HTMLInputElement>)}
          label="Trip Cover Image"
          placeholder="Enter image URL or upload an image"
        />
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>
    </div>
  );
}