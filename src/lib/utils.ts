import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate trip status based on dates
export function calculateTripStatus(startDate: string, endDate: string): 'planned' | 'ongoing' | 'completed' | 'cancelled' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If end date has passed, trip is completed
  if (now > end) {
    return 'completed';
  }
  
  // If start date has passed but end date hasn't, trip is ongoing
  if (now >= start && now <= end) {
    return 'ongoing';
  }
  
  // If start date hasn't arrived yet, trip is planned
  return 'planned';
}

// Update trip status based on dates
export function updateTripStatus(trip: any) {
  const calculatedStatus = calculateTripStatus(trip.startDate, trip.endDate);
  
  // Only update if the status is different and not manually set to cancelled
  if (trip.status !== calculatedStatus && trip.status !== 'cancelled') {
    return {
      ...trip,
      status: calculatedStatus,
      updatedAt: new Date().toISOString()
    };
  }
  
  return trip;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Check if trip is upcoming
export function isUpcomingTrip(trip: any): boolean {
  const now = new Date();
  const start = new Date(trip.startDate);
  return start > now;
}

// Check if trip is ongoing
export function isOngoingTrip(trip: any): boolean {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return now >= start && now <= end;
}

// Check if trip is completed
export function isCompletedTrip(trip: any): boolean {
  const now = new Date();
  const end = new Date(trip.endDate);
  return now > end;
}