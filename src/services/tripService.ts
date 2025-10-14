import { createResource, apiCall } from '@/lib/api';
import { Trip, TripParticipant } from '@/types/Trip';
import { updateTripStatus } from '@/lib/utils';

const tripsResource = createResource('trips');
const participantsResource = createResource('participants');
const paymentsResource = createResource('payments');

export const tripService = {
  // Basic CRUD operations
  ...tripsResource,

  // Trip-specific operations
  getUserTrips: async (userId: string): Promise<Trip[]> => {
    try {
      // Fetch all trips and filter by creator
      const allTrips = await tripsResource.getAll();
      
      // Filter trips created by the user
      const userTrips = allTrips.filter(trip => 
        trip.creatorId === userId || 
        trip.createdBy === userId || 
        trip.userId === userId
      );
      
      // Update status based on dates and return
      return userTrips.map(updateTripStatus);
    } catch (error) {
      console.error('Error fetching user trips:', error);
      return [];
    }
  },

  // Get all trips (for public viewing)
  getAllTrips: async (): Promise<Trip[]> => {
    try {
      const allTrips = await tripsResource.getAll();
      return allTrips.map(updateTripStatus);
    } catch (error) {
      console.error('Error fetching all trips:', error);
      return [];
    }
  },

  // Get trip by ID with updated status
  getTripById: async (tripId: string): Promise<Trip | null> => {
    try {
      const trip = await tripsResource.getById(tripId);
      return trip ? updateTripStatus(trip) : null;
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  },

  joinTrip: async (tripId: string, userId: string, passengers: number = 1): Promise<TripParticipant> => {
    const trip = await tripsResource.getById(tripId);
    
    if (!trip) throw new Error('Trip not found');

    // Check if already joined
    const existingParticipants = await participantsResource.getAll(`tripId=${tripId}&userId=${userId}`);
    if (existingParticipants.length > 0) {
      throw new Error('You have already joined this trip');
    }

    // Check available seats
    const availableSeats = trip.availableSeats || (trip.maxParticipants - (trip.currentParticipants || 0));
    if (availableSeats < passengers) {
      throw new Error(`Only ${availableSeats} seat(s) available`);
    }

    // Calculate payment
    const pricePerPerson = trip.pricePerPerson || Math.round((trip.budget || 0) / (trip.maxParticipants || 1));
    const totalAmount = passengers * pricePerPerson;
    const advancePaymentPercentage = trip.advancePaymentPercentage || 20;
    const advancePayment = Math.round(totalAmount * (advancePaymentPercentage / 100));

    // Create participant
    const participantData: TripParticipant = {
      id: Date.now().toString(),
      tripId,
      userId,
      passengers,
      totalAmount,
      advancePayment,
      finalAmount: totalAmount - advancePayment,
      paymentStatus: 'paid',
      status: 'confirmed',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const participant = await participantsResource.create(participantData);

    // Update trip
    await tripsResource.patch(tripId, {
      availableSeats: availableSeats - passengers,
      currentParticipants: (trip.currentParticipants || 0) + passengers,
      joinedUsers: [...(trip.joinedUsers || []), userId],
    });

    // Create payment
    await paymentsResource.create({
      tripId,
      userId,
      amount: advancePayment,
      paymentMethod: 'razorpay',
      transactionId: `TXN${Date.now()}`,
      paidAt: new Date().toISOString(),
    });

    return participant;
  },

  getUserJoinedTrips: async (userId: string): Promise<Trip[]> => {
    const participants = await participantsResource.getAll(`userId=${userId}`);
    const tripIds = participants.map(p => p.tripId);
    const trips = await tripsResource.getAll();
    
    return trips
      .filter(trip => tripIds.includes(trip.id))
      .map(trip => ({
        ...updateTripStatus(trip),
        participation: participants.find(p => p.tripId === trip.id)
      }));
  },

  hasUserJoinedTrip: async (tripId: string, userId: string): Promise<boolean> => {
    const participants = await participantsResource.getAll(`tripId=${tripId}&userId=${userId}`);
    return participants.length > 0;
  },

  getTripParticipants: (tripId: string): Promise<TripParticipant[]> =>
    participantsResource.getAll(`tripId=${tripId}`),

  cancelParticipation: async (tripId: string, userId: string): Promise<void> => {
    const participants = await participantsResource.getAll(`tripId=${tripId}&userId=${userId}`);
    const participant = participants[0];
    
    if (!participant) throw new Error('Participation not found');

    // Remove participant
    await participantsResource.delete(participant.id);

    // Update trip
    const trip = await tripsResource.getById(tripId);
    await tripsResource.patch(tripId, {
      availableSeats: (trip.availableSeats || 0) + participant.passengers,
      currentParticipants: Math.max(0, (trip.currentParticipants || 0) - participant.passengers),
      joinedUsers: (trip.joinedUsers || []).filter((id: string) => id !== userId),
    });
  },

  // Update trip status based on dates
  updateTripStatuses: async (): Promise<void> => {
    try {
      const allTrips = await tripsResource.getAll();
      const updatedTrips = allTrips.map(updateTripStatus);
      
      // Update trips that have status changes
      for (const trip of updatedTrips) {
        if (trip.status !== allTrips.find(t => t.id === trip.id)?.status) {
          await tripsResource.patch(trip.id, {
            status: trip.status,
            updatedAt: trip.updatedAt
          });
        }
      }
    } catch (error) {
      console.error('Error updating trip statuses:', error);
    }
  },
};