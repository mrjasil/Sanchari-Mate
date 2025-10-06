import { useState, useEffect } from 'react';
import { Trip } from '@/types/Trip';
import { tripAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const allTrips = await tripAPI.getAllTrips();
      setTrips(allTrips);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTrips = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userTrips = await tripAPI.getUserTrips(user.id);
      setTrips(userTrips);
    } catch (err) {
      setError('Failed to fetch user trips');
      console.error('Error fetching user trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: any): Promise<Trip> => {
    try {
      const newTrip = await tripAPI.createTrip(tripData);
      setTrips(prev => [...prev, newTrip]);
      return newTrip;
    } catch (err) {
      setError('Failed to create trip');
      throw err;
    }
  };

  const updateTrip = async (id: string, tripData: any): Promise<Trip> => {
    try {
      const updatedTrip = await tripAPI.updateTrip(id, tripData);
      setTrips(prev => prev.map(trip => trip.id === id ? updatedTrip : trip));
      return updatedTrip;
    } catch (err) {
      setError('Failed to update trip');
      throw err;
    }
  };

  const deleteTrip = async (id: string): Promise<void> => {
    try {
      await tripAPI.deleteTrip(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      setError('Failed to delete trip');
      throw err;
    }
  };

  const joinTrip = async (tripId: string, passengers: number = 1): Promise<any> => {
    if (!user) {
      throw new Error('User must be logged in to join a trip');
    }
    
    try {
      const result = await tripAPI.joinTrip(tripId, user.id, passengers);
      await fetchTrips(); // Refresh trips to update available seats
      return result;
    } catch (err) {
      setError('Failed to join trip');
      throw err;
    }
  };

  // Check if user has joined a specific trip
  const hasUserJoinedTrip = async (tripId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await tripAPI.hasUserJoinedTrip(tripId, user.id);
    } catch (err) {
      console.error('Error checking trip participation:', err);
      return false;
    }
  };

  // Get user's joined trips
  const fetchUserJoinedTrips = async (): Promise<Trip[]> => {
    if (!user) return [];
    
    try {
      return await tripAPI.getUserJoinedTrips(user.id);
    } catch (err) {
      console.error('Error fetching joined trips:', err);
      return [];
    }
  };

  // Cancel trip participation
  const cancelTripParticipation = async (tripId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to cancel participation');
    }
    
    try {
      await tripAPI.cancelParticipation(tripId, user.id);
      await fetchTrips(); // Refresh trips
    } catch (err) {
      setError('Failed to cancel trip participation');
      throw err;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    fetchUserTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    joinTrip,
    hasUserJoinedTrip,
    fetchUserJoinedTrips,
    cancelTripParticipation,
    setError
  };
};