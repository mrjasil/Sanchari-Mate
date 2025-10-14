// Initialize localStorage with proper data structure
export const initializeAPI = () => {
  if (typeof window === 'undefined') return;

  const resources = ['trips', 'users', 'participants', 'payments', 'bookings', 'enquiries'];
  
  resources.forEach(resource => {
    if (!localStorage.getItem(resource)) {
      localStorage.setItem(resource, '[]');
    }
  });

  // Initialize with sample data if empty
  initializeSampleData();
};

const initializeSampleData = () => {
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

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    const sampleUsers = [
      {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        isBlocked: false,
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-10-10T16:45:00Z',
        totalBookings: 5,
        role: 'user',
      }
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
};

// Initialize the API when imported
if (typeof window !== 'undefined') {
  initializeAPI();
}