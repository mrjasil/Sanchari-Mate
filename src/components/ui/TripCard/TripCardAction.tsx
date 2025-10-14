// components/ui/TripCard/TripCardActions.tsx
import { Trip } from "@/types/Trip";
import Link from "next/link";
import { useState } from "react";
import { useAlert } from "@/hooks/useAlert";
import { getSeatAvailability } from "./utils/seats";
import { usePayment } from "./hooks/usePayment";

interface TripCardActionsProps {
  trip: Trip;
  shouldShowActions: boolean;
  showEditButton: boolean;
  showDeleteButton: boolean;
  showJoinButton: boolean;
  showViewDetailsButton: boolean;
  userAlreadyJoined: boolean;
  joinLoading: boolean;
  onEdit?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
  onJoin?: (trip: Trip) => Promise<void>;
  onJoinLoadingChange: (loading: boolean) => void;
  onJoinError?: (error: string) => void;
}

declare global {
  interface Window { Razorpay: any; }
}

export default function TripCardActions({
  trip,
  shouldShowActions,
  showEditButton,
  showDeleteButton,
  showJoinButton,
  showViewDetailsButton,
  userAlreadyJoined,
  joinLoading,
  onEdit,
  onDelete,
  onJoin,
  onJoinLoadingChange,
  onJoinError
}: TripCardActionsProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const seats = getSeatAvailability(trip);
  const alert = useAlert();
  const { loading: gatewayLoading, startPayment } = usePayment();

  const clearLoadingStates = () => {
    setPaymentLoading(false);
    onJoinLoadingChange(false);
  };

  const handleSeatFullError = async () => {
    await alert.error('Trip Full', 'This trip is full. No seats available.');
    onJoinError?.('This trip is full. No seats available.');
  };

  const handleJoinWithPayment = async () => {
    if (!onJoin) return;

    if (seats.isFull) {
      await handleSeatFullError();
      return;
    }

    setPaymentLoading(true);
    onJoinLoadingChange(true);

    try {
      const paymentAmount = Math.round(trip.budget! * 0.2 * 100);
      const displayAmount = (paymentAmount / 100).toFixed(2);

      const paymentConfirm = await alert.confirm(
        'Confirm Payment',
        `You are about to pay ₹${displayAmount} (20% advance) to join "${trip.title}". Continue?`,
        'Pay Now',
        'Cancel'
      );

      if (!paymentConfirm.isConfirmed) {
        clearLoadingStates();
        return;
      }

      await startPayment(
        trip,
        paymentAmount,
        async () => { await onJoin?.(trip); },
        (msg) => onJoinError?.(msg)
      );
      
    } catch (error: any) {
      console.error('Payment initialization failed:', error);
      await alert.error('Payment Error', error.message || 'Failed to initialize payment gateway');
      onJoinError?.(error.message || 'Failed to initialize payment');
      clearLoadingStates();
    }
  };

  const handleDirectJoin = async () => {
    if (!onJoin) return;
    
    if (seats.isFull) {
      await handleSeatFullError();
      return;
    }

    const confirmJoin = await alert.confirm(
      'Join Trip',
      `Are you sure you want to join "${trip.title}"?`,
      'Yes, Join Trip',
      'Cancel'
    );

    if (!confirmJoin.isConfirmed) return;

    onJoinLoadingChange(true);
    try {
      await alert.loading('Completing your booking...');
      await onJoin(trip);
      await alert.close();
      await alert.success(
        'Successfully Joined!',
        `You have joined "${trip.title}". Check your trips for details.`
      );
    } catch (error: any) {
      console.error('Failed to join trip:', error);
      await alert.error('Join Failed', error.message || 'Failed to join the trip. Please try again.');
      onJoinError?.(error.message || 'Failed to join trip');
    } finally {
      onJoinLoadingChange(false);
    }
  };

  const handleJoinClick = async () => {
    if (seats.isFull) {
      await handleSeatFullError();
      return;
    }

    try {
      if (trip.budget) {
        await handleJoinWithPayment();
      } else {
        await handleDirectJoin();
      }
    } catch (error) {
      console.error('Error in join process:', error);
      clearLoadingStates();
    }
  };

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    const confirmDelete = await alert.deleteConfirm('this trip');
    if (confirmDelete.isConfirmed) onDelete(trip.id);
  };

  const handleEditClick = () => {
    if (!onEdit) return;
    
    if (trip.currentParticipants && trip.currentParticipants > 0) {
      alert.warning(
        'Edit Trip with Participants',
        'This trip already has participants. Changes may affect existing bookings.'
      ).then(() => onEdit(trip.id));
    } else {
      onEdit(trip.id);
    }
  };

  const isLoading = joinLoading || paymentLoading || gatewayLoading;
  const canJoin = showJoinButton && !shouldShowActions && onJoin && !userAlreadyJoined && !seats.isFull;

  return (
    <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
      <div className="space-y-3">
        {shouldShowActions && (showEditButton || showDeleteButton) && (
          <div className="flex space-x-3">
            {showEditButton && (
              <button 
                onClick={handleEditClick} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Trip
              </button>
            )}
            {showDeleteButton && (
              <button 
                onClick={handleDeleteClick} 
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}

        {showJoinButton && !shouldShowActions && onJoin && (
          <>
            {seats.isFull ? (
              <button 
                disabled 
                className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center justify-center shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Trip Full
              </button>
            ) : userAlreadyJoined ? (
              <button 
                disabled 
                className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center justify-center shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Already Joined
              </button>
            ) : (
              <button 
                onClick={handleJoinClick} 
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg ${
                  isLoading 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {trip.budget ? 'Processing Payment...' : 'Joining...'}
                  </>
                ) : trip.budget ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Pay & Join (20% Advance)
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Join Trip
                  </>
                )}
              </button>
            )}
          </>
        )}

        {canJoin && trip.budget && !isLoading && (
          <p className="text-xs text-center text-gray-500 mt-2">
            💳 20% advance payment (₹{(trip.budget * 0.2).toFixed(2)}) required to join this trip
          </p>
        )}

        {showJoinButton && !shouldShowActions && seats.available > 0 && seats.available <= 3 && (
          <p className="text-xs text-center text-orange-600 font-medium mt-2">
            ⚠️ Only {seats.available} seat{seats.available !== 1 ? 's' : ''} left!
          </p>
        )}

        {showViewDetailsButton && (
          <Link 
            href={`/trips/${trip.id}`}
            className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-center items-center justify-center shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}