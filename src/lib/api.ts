const API_BASE_URL = 'http://localhost:3001';

// Generic API function with fallback
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call failed:', error);
    return handleLocalStorageFallback(endpoint, options);
  }
}

// LocalStorage fallback function
function handleLocalStorageFallback(endpoint: string, options: RequestInit = {}) {
  const key = endpoint.split('/')[1];
  const id = endpoint.split('/')[2];
  const queryString = endpoint.split('?')[1];
  
  switch (options.method) {
    case 'GET':
      if (id) {
        const allData = JSON.parse(localStorage.getItem(key) || '[]');
        return allData.find((item: any) => item.id === id) || null;
      } else {
        const allData = JSON.parse(localStorage.getItem(key) || '[]');
        if (!queryString) return allData;
        
        const urlParams = new URLSearchParams(queryString);
        
        if (urlParams.has('createdBy')) {
          const userId = urlParams.get('createdBy');
          return allData.filter((item: any) => item.createdBy === userId);
        }
        
        if (urlParams.has('userId')) {
          const userId = urlParams.get('userId');
          return allData.filter((item: any) => item.userId === userId);
        }
        
        return allData;
      }
    
    case 'POST':
      const newItem = JSON.parse(options.body as string);
      newItem.id = newItem.id || Date.now().toString();
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedData = [...existingData, newItem];
      localStorage.setItem(key, JSON.stringify(updatedData));
      return newItem;
    
    case 'PUT':
      const putData = JSON.parse(options.body as string);
      const allItems = JSON.parse(localStorage.getItem(key) || '[]');
      const itemIndex = allItems.findIndex((item: any) => item.id === id);
      if (itemIndex !== -1) {
        allItems[itemIndex] = { ...allItems[itemIndex], ...putData };
        localStorage.setItem(key, JSON.stringify(allItems));
        return allItems[itemIndex];
      }
      return null;
    
    case 'PATCH':
      const patchData = JSON.parse(options.body as string);
      const allData = JSON.parse(localStorage.getItem(key) || '[]');
      const index = allData.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        allData[index] = { ...allData[index], ...patchData };
        localStorage.setItem(key, JSON.stringify(allData));
        return allData[index];
      }
      return null;
    
    case 'DELETE':
      const deleteData = JSON.parse(localStorage.getItem(key) || '[]');
      const filteredData = deleteData.filter((item: any) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filteredData));
      return { success: true };
    
    default:
      return [];
  }
}

// Trip API functions
import { Trip, TripParticipant, PaymentDetails } from '@/types/Trip';

export const tripAPI = {
  // Trip operations
  getAllTrips: (): Promise<Trip[]> => apiCall('/trips'),
  
  getUserTrips: (userId: string): Promise<Trip[]> => apiCall(`/trips?createdBy=${userId}`),
  
  getTrip: (id: string): Promise<Trip> => apiCall(`/trips/${id}`),
  
  createTrip: (tripData: any): Promise<Trip> => 
    apiCall('/trips', {
      method: 'POST',
      body: JSON.stringify({
        ...tripData,
        id: tripData.id || Date.now().toString(),
        createdAt: tripData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        availableSeats: tripData.maxParticipants || 1,
        currentParticipants: 0,
        joinedUsers: [],
        participants: [],
      }),
    }),
  
  updateTrip: (id: string, tripData: any): Promise<Trip> =>
    apiCall(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...tripData,
        updatedAt: new Date().toISOString(),
      }),
    }),

  patchTrip: (id: string, tripData: Partial<Trip>): Promise<Trip> =>
    apiCall(`/trips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...tripData,
        updatedAt: new Date().toISOString(),
      }),
    }),
  
  deleteTrip: (id: string): Promise<{ success: boolean }> =>
    apiCall(`/trips/${id}`, {
      method: 'DELETE',
    }),

  // Join trip functionality - FIXED: Only basic PaymentDetails properties
  joinTrip: async (tripId: string, userId: string, passengers: number = 1): Promise<TripParticipant> => {
    // Get the trip first
    const trip = await tripAPI.getTrip(tripId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user has already joined
    const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
    const alreadyJoined = existingParticipants.find(
      (p: any) => p.tripId === tripId && p.userId === userId
    );

    if (alreadyJoined) {
      throw new Error('You have already joined this trip');
    }

    // Check available seats
    const availableSeats = trip.availableSeats || (trip.maxParticipants - (trip.currentParticipants || 0));
    if (availableSeats < passengers) {
      throw new Error(`Only ${availableSeats} seat(s) available`);
    }

    // Calculate payment details
    const pricePerPerson = trip.pricePerPerson || Math.round((trip.budget || 0) / (trip.maxParticipants || 1));
    const totalAmount = passengers * pricePerPerson;
    const advancePaymentPercentage = trip.advancePaymentPercentage || 20;
    const advancePayment = Math.round(totalAmount * (advancePaymentPercentage / 100));

    // Create participant data
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

    // Save participant
    const participant = await apiCall('/participants', {
      method: 'POST',
      body: JSON.stringify(participantData),
    });

    // Update trip data
    const updatedTrip = {
      ...trip,
      availableSeats: availableSeats - passengers,
      currentParticipants: (trip.currentParticipants || 0) + passengers,
      joinedUsers: [...(trip.joinedUsers || []), userId],
      participants: [...(trip.participants || []), participantData],
      updatedAt: new Date().toISOString(),
    };

    await tripAPI.updateTrip(tripId, updatedTrip);

    // Create payment record - ONLY basic properties
    const paymentData = {
      id: Date.now().toString(),
      tripId,
      userId,
      amount: advancePayment,
      paymentMethod: 'razorpay' as const,
      transactionId: `TXN${Date.now()}`,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });

    return participant;
  },

  // Get user's joined trips
  getUserJoinedTrips: async (userId: string): Promise<Trip[]> => {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    const userParticipations = participants.filter((p: any) => p.userId === userId);
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    
    return userParticipations.map((participation: any) => {
      const trip = trips.find((t: any) => t.id === participation.tripId);
      return trip ? { ...trip, participation } : null;
    }).filter(Boolean);
  },

  // Check if user has joined a trip
  hasUserJoinedTrip: async (tripId: string, userId: string): Promise<boolean> => {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    return participants.some((p: any) => p.tripId === tripId && p.userId === userId);
  },

  // Get trip participants
  getTripParticipants: async (tripId: string): Promise<TripParticipant[]> => {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    return participants.filter((p: any) => p.tripId === tripId);
  },

  // Payment functions - FIXED: Only basic properties
  createPayment: (paymentData: any): Promise<PaymentDetails> =>
    apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify({
        ...paymentData,
        id: Date.now().toString(),
      }),
    }),

  getUserPayments: (userId: string): Promise<PaymentDetails[]> =>
    apiCall(`/payments?userId=${userId}`),

  // Cancel trip participation
  cancelParticipation: async (tripId: string, userId: string): Promise<void> => {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    const participant = participants.find((p: any) => p.tripId === tripId && p.userId === userId);
    
    if (!participant) {
      throw new Error('Participation not found');
    }

    // Remove participant
    const updatedParticipants = participants.filter((p: any) => !(p.tripId === tripId && p.userId === userId));
    localStorage.setItem('participants', JSON.stringify(updatedParticipants));

    // Update trip
    const trip = await tripAPI.getTrip(tripId);
    const updatedTrip = {
      ...trip,
      availableSeats: (trip.availableSeats || 0) + participant.passengers,
      currentParticipants: Math.max(0, (trip.currentParticipants || 0) - participant.passengers),
      joinedUsers: (trip.joinedUsers || []).filter((id: string) => id !== userId),
      participants: (trip.participants || []).filter((p: any) => p.userId !== userId),
      updatedAt: new Date().toISOString(),
    };

    await tripAPI.updateTrip(tripId, updatedTrip);
  },
};

// Initialize localStorage with proper data structure
export const initializeAPI = () => {
  if (typeof window === 'undefined') return;

  const keys = ['trips', 'users', 'participants', 'payments'];
  
  keys.forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '[]');
    }
  });

  // Initialize with sample data if empty
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  if (trips.length === 0) {
    const sampleTrips = [
      {
        id: '1',
        title: 'Beach Paradise Goa',
        destination: 'Goa, India',
        description: 'Enjoy the beautiful beaches and nightlife of Goa',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        budget: 20000,
        pricePerPerson: 5000,
        maxParticipants: 10,
        availableSeats: 8,
        currentParticipants: 2,
        status: 'planned',
        category: 'Beach, Adventure',
        image: '/images/goa-beach.jpg',
        createdBy: 'user1',
        joinedUsers: [],
        participants: [],
        advancePaymentPercentage: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem('trips', JSON.stringify(sampleTrips));
  }
};

// Initialize the API when imported
if (typeof window !== 'undefined') {
  initializeAPI();
}

export default tripAPI;