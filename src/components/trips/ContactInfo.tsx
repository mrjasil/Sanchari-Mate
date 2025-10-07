import { Trip } from '@/types/Trip';

interface ContactInfoProps {
  trip: Trip;
}

export default function ContactInfo({ trip }: ContactInfoProps) {
  if (!trip.meetupLocation && !trip.contactInfo) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact & Meeting Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trip.meetupLocation && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Meetup Location</h4>
            <p className="text-gray-700">{trip.meetupLocation}</p>
          </div>
        )}
        {trip.contactInfo && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
            <p className="text-gray-700">{trip.contactInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}