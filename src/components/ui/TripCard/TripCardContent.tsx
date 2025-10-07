// components/ui/TripCard/TripCardContent.tsx
import { Trip } from "@/types/Trip";

interface TripCardContentProps {
  trip: Trip;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getSeatAvailability = (trip: Trip) => {
  const maxParticipants = trip.maxParticipants || 0;
  const currentParticipants = trip.currentParticipants || 0;
  const availableSeats = maxParticipants - currentParticipants;
  
  return {
    max: maxParticipants,
    current: currentParticipants,
    available: availableSeats,
    isFull: availableSeats <= 0
  };
};

export default function TripCardContent({ trip }: TripCardContentProps) {
  const seats = getSeatAvailability(trip);

  return (
    <div className="p-6 flex flex-col flex-grow">
      {/* Title */}
      <h3 className="font-bold text-2xl text-gray-900 mb-3 line-clamp-2 leading-tight">
        {trip.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-base mb-5 line-clamp-3 flex-grow leading-relaxed">
        {trip.description}
      </p>
      
      {/* Trip Details */}
      <div className="space-y-3 mb-2">
        <div className="flex items-center text-sm text-gray-700">
          <span className="mr-3 text-xl">📍</span>
          <span className="font-semibold text-lg">{trip.destination}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-3 text-xl">📅</span>
          <span className="text-base">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        
        {/* Seat Availability */}
        <div className="flex items-center text-sm">
          <span className="mr-3 text-xl">👥</span>
          <div className="flex items-center space-x-2">
            <span className={`text-base font-semibold ${
              seats.isFull ? 'text-red-600' : 'text-green-600'
            }`}>
              {seats.available} seat{seats.available !== 1 ? 's' : ''} available
            </span>
            {seats.max > 0 && (
              <span className="text-gray-500 text-sm">
                (of {seats.max})
              </span>
            )}
          </div>
        </div>
        
        {trip.budget && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-3 text-xl">💰</span>
            <span className="text-base">
              Budget: <span className="font-bold text-green-600">${trip.budget.toLocaleString()}</span>
            </span>
          </div>
        )}
      </div>

      {/* Full Trip Badge */}
      {seats.isFull && (
        <div className="mt-3 px-3 py-2 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-semibold text-sm">Trip Full - No Seats Available</span>
          </div>
        </div>
      )}
    </div>
  );
}