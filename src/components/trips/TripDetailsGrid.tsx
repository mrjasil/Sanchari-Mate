import { Trip } from '@/types/Trip';
import { formatDate } from '@/lib/format';

interface TripDetailsGridProps {
  trip: Trip;
}

export default function TripDetailsGrid({ trip }: TripDetailsGridProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates & Schedule</h3>
      <div className="space-y-3">
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
      <div className="space-y-3">
        {trip.category && <DetailItem label="Category" value={trip.category} />}
        {trip.accommodation && <DetailItem label="Accommodation" value={trip.accommodation} />}
        {trip.transportation && <DetailItem label="Transportation" value={trip.transportation} />}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}