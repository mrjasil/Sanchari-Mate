"use client";
import { useState, useEffect } from 'react';
import { Trip } from '@/types/Trip';

interface JoinTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (request: any) => Promise<void>;
  userAlreadyJoined: boolean;
}

export default function JoinTripModal({
  trip,
  isOpen,
  onClose,
  onJoin,
  userAlreadyJoined
}: JoinTripModalProps) {
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassengers(1);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  const maxPassengers = Math.min(trip.availableSeats || 1, 10);
  const pricePerPerson = trip.pricePerPerson || Math.round((trip.budget || 0) / (trip.maxParticipants || 1));
  const totalAmount = passengers * pricePerPerson;
  const advancePaymentPercentage = trip.advancePaymentPercentage || 20;
  const advancePayment = totalAmount * (advancePaymentPercentage / 100);

  const handleJoin = async () => {
    if (userAlreadyJoined) return setError('You have already joined this trip');
    if (passengers < 1) return setError('At least 1 passenger required');
    if (passengers > (trip.availableSeats || 1)) return setError(`Only ${trip.availableSeats} seats available`);
    
    setLoading(true);
    try {
      await onJoin({
        tripId: trip.id,
        passengers,
        advancePayment,
        totalAmount
      });
      onClose();
    } catch (err) {
      setError('Failed to join trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4">Join Trip: {trip.title}</h2>

          {userAlreadyJoined ? (
            <div className="text-center py-4">
              <div className="text-green-500 text-4xl mb-2">✓</div>
              <p className="text-gray-700">You have already joined this trip!</p>
              <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Close</button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex justify-between mb-2"><span>Available Seats:</span><span className="font-semibold">{trip.availableSeats || 1}</span></div>
                <div className="flex justify-between mb-2"><span>Price per person:</span><span className="font-semibold">₹{pricePerPerson}</span></div>
                <div className="flex justify-between"><span>Advance Payment:</span><span className="font-semibold">{advancePaymentPercentage}%</span></div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Number of Passengers</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setPassengers(Math.max(1, passengers - 1))} disabled={passengers <= 1} className="w-8 h-8 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors">-</button>
                  <span className="text-lg font-semibold">{passengers}</span>
                  <button onClick={() => setPassengers(Math.min(maxPassengers, passengers + 1))} disabled={passengers >= maxPassengers} className="w-8 h-8 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors">+</button>
                  <span className="text-sm text-gray-600 ml-2">Max: {maxPassengers}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded mb-4">
                <div className="flex justify-between mb-2"><span>Total Amount:</span><span className="font-semibold">₹{totalAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Advance Payment ({advancePaymentPercentage}%):</span><span className="font-semibold text-green-600">₹{advancePayment.toFixed(2)}</span></div>
              </div>

              {error && <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">{error}</div>}

              <div className="flex gap-3">
                <button onClick={onClose} disabled={loading} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors">Cancel</button>
                <button onClick={handleJoin} disabled={loading || (trip.availableSeats || 0) === 0} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors">
                  {loading ? 'Processing...' : `Pay ₹${advancePayment.toFixed(2)} Advance`}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">* You'll be redirected to secure payment processing</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}