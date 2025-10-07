"use client";
import Link from 'next/link';
import { Trip } from '@/types/Trip';
import { useAuthStore } from '@/store/authStore';
import JoinTripButton from './JoinTripButton';

interface TripDetailsHeaderProps {
  trip: Trip;
}

export default function TripDetailsHeader({ trip }: TripDetailsHeaderProps) {
  const { user } = useAuthStore();
  const isCreator = user?.id === trip.createdBy;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            href="/trips/all" 
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Trips
          </Link>
          
          <div className="flex items-center space-x-4">
            {isCreator && (
              <Link
                href={`/trips/edit/${trip.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Trip
              </Link>
            )}
            <JoinTripButton trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}