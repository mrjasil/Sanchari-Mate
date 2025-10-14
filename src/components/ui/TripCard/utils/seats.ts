import { Trip } from "@/types/Trip";

export interface SeatAvailability {
	available: number;
	isFull: boolean;
}

export const getSeatAvailability = (trip: Trip): SeatAvailability => {
	const maxParticipants = trip.maxParticipants || 0;
	const currentParticipants = trip.currentParticipants || 0;
	const availableSeats = maxParticipants - currentParticipants;

	return {
		available: availableSeats,
		isFull: availableSeats <= 0,
	};
};


