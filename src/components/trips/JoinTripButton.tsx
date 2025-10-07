"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '@/types/Trip';
import { useAuthStore } from '@/store/authStore';
import JoinTripModal from '@/components/ui/JoinTrip';
import tripAPI from '@/lib/api';

interface JoinTripButtonProps {
  trip: Trip;
  fullWidth?: boolean;
}

export default function JoinTripButton({ trip, fullWidth = false }: JoinTripButtonProps) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userAlreadyJoined, setUserAlreadyJoined] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const currentParticipants = trip.currentParticipants || trip.participants?.length || 0;
  const maxParticipants = trip.maxParticipants || 1;
  const availableSeats = trip.availableSeats !== undefined ? trip.availableSeats : (maxParticipants - currentParticipants);
  
  const isCreator = user?.id === trip.createdBy;
  const canJoin = availableSeats > 0 && 
                 !userAlreadyJoined && 
                 trip.status === 'planned' &&
                 !isCreator;

  const handleJoinClick = () => {
    if (!isAuthenticated || !user) {
      alert('Please login to join this trip');
      router.push('/login');
      return;
    }
    setShowJoinModal(true);
  };

  const handleJoinConfirm = async (request: any) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');
      await tripAPI.joinTrip(request.tripId, user.id, request.passengers);
      alert(`Successfully joined the trip! Advance payment: ₹${request.advancePayment}`);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || 'Failed to join trip. Please try again.');
    }
  };

  if (userAlreadyJoined) {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} text-center py-3 bg-green-50 text-green-700 rounded-lg border border-green-200`}>
        ✓ You've joined this trip
      </div>
    );
  }

  if (isCreator) {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} text-center py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200`}>
        👑 You created this trip
      </div>
    );
  }

  if (!canJoin) return null;

  return (
    <>
      <button
        onClick={handleJoinClick}
        className={`${fullWidth ? 'w-full' : ''} bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium`}
      >
        Join Trip
      </button>

      <JoinTripModal
        trip={showJoinModal ? trip : null}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinConfirm}
        userAlreadyJoined={userAlreadyJoined}
      />
    </>
  );
}