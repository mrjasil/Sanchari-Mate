import Image from 'next/image';
import { Trip } from '@/types/Trip';
import TripStatusBadge from './TripStatusBadge';
import { formatCurrency } from '@/lib/format';

interface TripHeroSectionProps {
  trip: Trip;
}

export default function TripHeroSection({ trip }: TripHeroSectionProps) {
  const currentParticipants = trip.currentParticipants || trip.participants?.length || 0;
  const maxParticipants = trip.maxParticipants || 1;
  const availableSeats = trip.availableSeats !== undefined ? trip.availableSeats : (maxParticipants - currentParticipants);
  const pricePerPerson = trip.pricePerPerson || Math.round((trip.budget || 0) / maxParticipants);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-80">
        {trip.image ? (
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-6xl">🌍</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <TripStatusBadge status={trip.status} />
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {availableSeats} seat{availableSeats !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
            <div className="flex items-center text-lg text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trip.destination}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(pricePerPerson)}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {trip.description}
        </p>

        <TripStats trip={trip} />
      </div>
    </div>
  );
}

function TripStats({ trip }: { trip: Trip }) {
  const currentParticipants = trip.currentParticipants || trip.participants?.length || 0;
  const maxParticipants = trip.maxParticipants || 1;

  const stats = [
    { label: 'Participants', value: currentParticipants },
    { label: 'Max Capacity', value: maxParticipants },
    { label: 'Advance Payment', value: `${trip.advancePaymentPercentage || 20}%` },
    { label: 'Total Budget', value: formatCurrency(trip.budget || 0) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}