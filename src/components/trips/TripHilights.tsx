import { Trip } from '@/types/Trip';
import ContactInfo from './ContactInfo';

interface TripHighlightsItineraryProps {
  trip: Trip;
}

export default function TripHighlightsItinerary({ trip }: TripHighlightsItineraryProps) {
  const hasHighlights = trip.highlights?.length > 0;
  const hasItinerary = trip.itinerary?.length > 0;
  const hasContactInfo = trip.meetupLocation || trip.contactInfo;

  if (!hasHighlights && !hasItinerary && !hasContactInfo) return null;

  return (
    <>
      {(hasHighlights || hasItinerary) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hasHighlights && <HighlightsSection highlights={trip.highlights} />}
          {hasItinerary && <ItinerarySection itinerary={trip.itinerary} />}
        </div>
      )}
      
      {hasContactInfo && <ContactInfo trip={trip} />}
    </>
  );
}

function HighlightsSection({ highlights }: { highlights: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        Trip Highlights
      </h3>
      <ul className="space-y-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItinerarySection({ itinerary }: { itinerary: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Itinerary
      </h3>
      <ol className="space-y-3">
        {itinerary.map((item, index) => (
          <li key={index} className="flex">
            <span className="font-medium text-blue-600 mr-3 min-w-12">Day {index + 1}</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}