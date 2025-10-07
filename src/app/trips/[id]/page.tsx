"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trip } from '@/types/Trip';
import { tripAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import TripDetailsHeader from '@/components/trips/TripDetailsHeader';
import TripHeroSection from '@/components/trips/TripHeroSection';
import TripDetailsGrid from '@/components/trips/TripDetailsGrid';
import TripHighlightsItinerary from '@/components/trips/TripHilights';
import TripSidebar from '@/components/trips/TripSideBar';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchTripDetails = async () => {
      // Check if params or tripId is null/undefined
      if (!params || !tripId) {
        setError('Invalid trip ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const tripData = await tripAPI.getTrip(tripId);
        if (tripData) {
          setTrip(tripData);
        } else {
          setError('Trip not found');
        }
      } catch (error) {
        console.error('Failed to fetch trip details:', error);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, params]);

  // Handle invalid trip ID early
  if (!tripId) {
    return (
      <ErrorState 
        message="Invalid trip URL" 
        action={{
          label: "Browse All Trips",
          href: "/trips/all"
        }}
      />
    );
  }

  if (loading) return <LoadingState message="Loading trip details..." />;
  if (error || !trip) return <ErrorState message={error || 'Trip not found'} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <TripDetailsHeader trip={trip} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TripHeroSection trip={trip} />
            <TripDetailsGrid trip={trip} />
            <TripHighlightsItinerary trip={trip} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <TripSidebar trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}