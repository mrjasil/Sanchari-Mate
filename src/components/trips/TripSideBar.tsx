import { Trip } from '@/types/Trip';
import JoinTripButton from './JoinTripButton';
import TripTags from './TripTags';
import { formatCurrency } from '@/lib/format';

interface TripSidebarProps {
  trip: Trip;
}

export default function TripSidebar({ trip }: TripSidebarProps) {
  const currentParticipants = trip.currentParticipants || trip.participants?.length || 0;
  const maxParticipants = trip.maxParticipants || 1;
  const availableSeats = trip.availableSeats !== undefined ? trip.availableSeats : (maxParticipants - currentParticipants);
  const pricePerPerson = trip.pricePerPerson || Math.round((trip.budget || 0) / maxParticipants);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h3>
        
        <div className="space-y-4">
          <SummaryItem label="Price per person" value={formatCurrency(pricePerPerson)} />
          <SummaryItem label="Advance payment" value={`${trip.advancePaymentPercentage || 20}%`} />
          <SummaryItem 
            label="Available seats" 
            value={`${availableSeats} of ${maxParticipants}`}
            highlight={availableSeats > 0}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <JoinTripButton trip={trip} fullWidth />
        </div>
      </div>

      {trip.tags?.length > 0 && <TripTags tags={trip.tags} />}
      
      <ShareTripSection />
    </>
  );
}

function SummaryItem({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-medium ${highlight ? (value.includes('0 of') ? 'text-red-600' : 'text-green-600') : ''}`}>
        {value}
      </span>
    </div>
  );
}

function ShareTripSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Trip</h3>
      <div className="flex space-x-3">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Share
        </button>
        <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
          Copy Link
        </button>
      </div>
    </div>
  );
}