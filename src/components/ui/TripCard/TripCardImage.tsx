// components/ui/TripCard/TripCardImage.tsx
import { Trip } from "@/types/Trip";

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

export default function TripCardImage({ 
  trip, 
  imageError, 
  imageLoading, 
  currentUserId, 
  onImageLoad, 
  onImageError 
}: TripCardImageProps) {
  const showFallbackImage = !isValidImageUrl(trip.imageUrl) || imageError;

  return (
    <div className="h-52 bg-gradient-to-br from-blue-400 to-purple-500 relative flex-shrink-0 overflow-hidden">
      {showFallbackImage ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
          <div className="text-center">
            <span className="text-white text-6xl mb-2 block">🌎</span>
            <p className="text-white text-sm font-medium">{trip.destination}</p>
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
            src={trip.imageUrl!}
            alt={trip.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={onImageLoad}
            onError={onImageError}
          />
        </>
      )}
      
      {/* Status Badge */}
      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(trip.status)}`}>
        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
      </div>

      {/* Creator Badge */}
      {currentUserId === trip.creatorId && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-purple-600 shadow-lg border border-purple-200">
          ✨ Your Trip
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}