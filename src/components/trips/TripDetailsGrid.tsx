import { Trip } from '@/types/Trip';
import { formatDate } from '@/lib/format';

interface TripDetailsGridProps {
  trip: Trip;
}

export default function TripDetailsGrid({ trip }: TripDetailsGridProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Trip Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TripDates trip={trip} />
        <TripInformation trip={trip} />
      </div>
    </div>
  );
}

function TripDates({ trip }: { trip: Trip }) {
  const duration = trip.startDate && trip.endDate ? 
    Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 
    'TBD';

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Dates & Schedule</h3>
      <div className="space-y-4">
        <DetailItem label="Start Date" value={formatDate(trip.startDate)} />
        <DetailItem label="End Date" value={formatDate(trip.endDate)} />
        <DetailItem label="Duration" value={duration} />
      </div>
    </div>
  );
}

function TripInformation({ trip }: { trip: Trip }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Trip Information</h3>
      <div className="space-y-4">
        {trip.category && <DetailItem label="Category" value={trip.category} />}
        {trip.accommodation && <DetailItem label="Accommodation" value={trip.accommodation} />}
        {trip.transportation && <DetailItem label="Transportation" value={trip.transportation} />}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-lg text-gray-600 font-medium">{label}:</span>
      <span className="text-lg font-semibold text-gray-900 max-w-[60%] text-right break-words">
        {value}
      </span>
    </div>
  );
}