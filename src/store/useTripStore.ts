import { create } from 'zustand';
import { Trip } from '@/types/Trip';

interface TripState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  setTrips: (trips: Trip[]) => void;
  setSelectedTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (tripId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,
  
  setTrips: (trips: Trip[]) => set({ trips }),
  
  setSelectedTrip: (trip: Trip | null) => set({ selectedTrip: trip }),
  
  addTrip: (trip: Trip) => 
    set((state) => ({ 
      trips: [...state.trips, trip] 
    })),
  
  updateTrip: (updatedTrip: Trip) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      ),
      selectedTrip: state.selectedTrip?.id === updatedTrip.id ? updatedTrip : state.selectedTrip,
    })),
  
  removeTrip: (tripId: string) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== tripId),
      selectedTrip: state.selectedTrip?.id === tripId ? null : state.selectedTrip,
    })),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
}));