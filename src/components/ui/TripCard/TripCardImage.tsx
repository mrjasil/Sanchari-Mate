// components/ui/TripCard/TripCardImage.tsx
import { Trip } from "@/types/Trip";
import { calculateTripStatus } from "@/lib/utils";

interface TripCardImageProps {
  trip: Trip;
  imageError: boolean;
  imageLoading: boolean;
  currentUserId?: string;
  onImageLoad: () => void;
  onImageError: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned': return 'bg-blue-500 text-white';
    case 'ongoing': return 'bg-green-500 text-white';
    case 'completed': return 'bg-gray-500 text-white';
    case 'cancelled': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  if (url === 'null' || url === 'undefined' || url === '') return false;
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return true;
  return false;
};

// Get destination-based fallback image
const getDestinationImage = (destination: string) => {
  const destinationImages: { [key: string]: string } = {
    'paris': '🗼',
    'tokyo': '🏯',
    'new york': '🗽',
    'london': '🏰',
    'rome': '🏛️',
    'barcelona': '🏟️',
    'amsterdam': '🌷',
    'prague': '🏰',
    'venice': '🚣',
    'santorini': '🏝️',
    'dubai': '🏢',
    'singapore': '🌴',
    'bangkok': '🏮',
    'bali': '🌺',
    'maldives': '🏖️',
    'goa': '🏖️',
    'kerala': '🚣',
    'rajasthan': '🏰',
    'himachal': '🏔️',
    'kashmir': '🏔️',
    'ladakh': '🏔️',
    'sikkim': '🏔️',
    'uttarakhand': '🏔️',
    'default': '🌎'
  };
  
  const lowerDestination = destination.toLowerCase();
  for (const [key, emoji] of Object.entries(destinationImages)) {
    if (lowerDestination.includes(key)) {
      return emoji;
    }
  }
  return destinationImages.default;
};

// Get category-based gradient
const getCategoryGradient = (category: string) => {
  const gradients: { [key: string]: string } = {
    'adventure': 'from-green-400 to-blue-500',
    'beach': 'from-blue-400 to-cyan-500',
    'mountain': 'from-gray-400 to-blue-600',
    'city': 'from-purple-400 to-pink-500',
    'cultural': 'from-orange-400 to-red-500',
    'nature': 'from-green-400 to-emerald-500',
    'spiritual': 'from-indigo-400 to-purple-600',
    'wildlife': 'from-yellow-400 to-orange-500',
    'default': 'from-blue-400 to-purple-500'
  };
  
  const lowerCategory = category?.toLowerCase() || 'default';
  return gradients[lowerCategory] || gradients.default;
};

export default function TripCardImage({ 
  trip, 
  imageError, 
  imageLoading, 
  currentUserId, 
  onImageLoad, 
  onImageError 
}: TripCardImageProps) {
  // Check both imageUrl and image fields for backward compatibility
  const imageUrl = trip.imageUrl || trip.image;
  const showFallbackImage = !isValidImageUrl(imageUrl) || imageError;
  const destinationEmoji = getDestinationImage(trip.destination);
  const gradientClass = getCategoryGradient(trip.category);
  
  // Calculate status based on dates (unless manually cancelled)
  const displayStatus = trip.status === 'cancelled' ? 'cancelled' : calculateTripStatus(trip.startDate, trip.endDate);

  return (
    <div className={`h-52 bg-gradient-to-br ${gradientClass} relative flex-shrink-0 overflow-hidden`}>
      {showFallbackImage ? (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}>
          <div className="text-center">
            <span className="text-white text-6xl mb-2 block">{destinationEmoji}</span>
            <p className="text-white text-sm font-medium">{trip.destination}</p>
            <p className="text-white text-xs opacity-80 mt-1">{trip.category}</p>
          </div>
        </div>
      ) : (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
          )}
          <img 
            src={imageUrl!}
            alt={`${trip.title} - ${trip.destination}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={onImageLoad}
            onError={onImageError}
            loading="lazy"
          />
        </>
      )}
      
      {/* Status Badge */}
      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(displayStatus)}`}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </div>

      {/* Creator Badge */}
      {currentUserId === trip.creatorId && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-purple-600 shadow-lg border border-purple-200">
          ✨ Your Trip
        </div>
      )}

      {/* Participants Count */}
      {trip.currentParticipants > 0 && (
        <div className="absolute bottom-4 left-4 px-2 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
          👥 {trip.currentParticipants}/{trip.maxParticipants}
        </div>
      )}

      {/* Budget Badge */}
      {trip.budget > 0 && (
        <div className="absolute bottom-4 right-4 px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
          ₹{trip.budget.toLocaleString()}
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}