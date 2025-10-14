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
      <h3 className="font-bold text-2xl text-gray-900 mb-4 line-clamp-2 leading-tight min-h-[3.5rem]">
        {trip.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-base mb-6 line-clamp-3 flex-grow leading-relaxed min-h-[4.5rem]">
        {trip.description}
      </p>
      
      {/* Trip Details */}
      <div className="space-y-4 mb-3">
        <div className="flex items-center text-gray-700">
          <span className="mr-4 text-2xl">📍</span>
          <div>
            <div className="text-sm text-gray-500 font-medium">Destination</div>
            <span className="font-bold text-lg">{trip.destination}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600">
          <span className="mr-4 text-2xl">📅</span>
          <div>
            <div className="text-sm text-gray-500 font-medium">Trip Dates</div>
            <span className="text-base font-semibold">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
        
        {/* Seat Availability */}
        <div className="flex items-center">
          <span className="mr-4 text-2xl">👥</span>
          <div>
            <div className="text-sm text-gray-500 font-medium">Seat Availability</div>
            <div className="flex items-center space-x-2">
              <span className={`text-base font-bold ${
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
        </div>
        
        {trip.budget && (
          <div className="flex items-center text-gray-600">
            <span className="mr-4 text-2xl">💰</span>
            <div>
              <div className="text-sm text-gray-500 font-medium">Total Budget</div>
              <span className="text-base font-bold text-green-600">
                ${trip.budget.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full Trip Badge */}
      {seats.isFull && (
        <div className="mt-4 px-4 py-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-bold text-base">Trip Full - No Seats Available</span>
          </div>
        </div>
      )}
    </div>
  );
}