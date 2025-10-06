"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Trip } from '@/types/Trip';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tripAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import JoinTripModal from './JoinTrip';

interface TripCardProps {
  trip: Trip;
  showUser?: boolean;
  onJoin?: (trip: Trip) => void;
  userAlreadyJoined?: boolean;
  showJoinButton?: boolean;
  currentUserId?: string;
  onEdit?: (trip: Trip) => void;
  showEditButton?: boolean;
  onJoinUpdate?: () => void;
}

export default function TripCard({ 
  trip, 
  showUser = false, 
  onJoin,
  userAlreadyJoined = false,
  showJoinButton = true,
  currentUserId,
  onEdit,
  showEditButton = false,
  onJoinUpdate
}: TripCardProps) {
  const [imageError, setImageError] = useState(false);
  const [joining, setJoining] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentParticipants = trip.currentParticipants || trip.participants?.length || 0;
  const maxParticipants = trip.maxParticipants || 1;
  const availableSeats = trip.availableSeats !== undefined ? trip.availableSeats : (maxParticipants - currentParticipants);
  
  const budget = trip.budget || 0;
  const pricePerPerson = trip.pricePerPerson || Math.round(budget / maxParticipants);
  const advancePaymentPercentage = trip.advancePaymentPercentage || 20;

  const isTripCreator = currentUserId && trip.createdBy === currentUserId;
  const canJoin = showJoinButton && 
                 availableSeats > 0 && 
                 !userAlreadyJoined && 
                 trip.status === 'planned' &&
                 !isTripCreator;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      alert('Please login to join this trip');
      router.push('/login');
      return;
    }

    if (!canJoin) {
      if (userAlreadyJoined) {
        alert('You have already joined this trip');
      } else if (isTripCreator) {
        alert('You cannot join your own trip');
      } else if (availableSeats === 0) {
        alert('This trip is already full');
      } else if (trip.status !== 'planned') {
        alert('This trip is not available for joining');
      }
      return;
    }

    // Show the join modal
    setShowJoinModal(true);
  };

  const handleJoinConfirm = async (request: any) => {
    setJoining(true);
    setJoinError(null);
    
    try {
      // FIX: Check if user exists and has an ID before proceeding
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Use the join request from modal - FIXED: user.id is guaranteed to be string
      await tripAPI.joinTrip(request.tripId, user.id, request.passengers);
      
      // Show success message
      alert(`Successfully joined the trip! Advance payment: ₹${request.advancePayment}`);
      
      // Refresh parent component if callback provided
      if (onJoinUpdate) {
        onJoinUpdate();
      } else {
        // Refresh the page to show updated status
        window.location.reload();
      }
      
      setShowJoinModal(false);
    } catch (error: any) {
      console.error('Error joining trip:', error);
      const errorMessage = error.message || 'Failed to join trip. Please try again.';
      setJoinError(errorMessage);
      alert(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    
    if (onEdit) {
      onEdit(trip);
    } else {
      router.push(`/trips/edit/${trip.id}`);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    
    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await tripAPI.deleteTrip(trip.id);
        alert('Trip deleted successfully!');
        if (onJoinUpdate) {
          onJoinUpdate();
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/trips/${trip.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 relative">
        {/* Three-dot dropdown menu */}
        {showEditButton && isTripCreator && (
          <div className="absolute top-2 right-2 z-20" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="bg-white text-gray-600 p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50 border border-gray-200"
              title="More options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-30">
                <button
                  onClick={handleEditClick}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Image Section */}
        <div className="relative h-48 cursor-pointer" onClick={handleViewDetails}>
          {!imageError ? (
            <Image
              src={trip.image || '/images/default-trip.jpg'}
              alt={trip.title}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-4xl">🌍</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
              {trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1) : 'Planned'}
            </span>
          </div>
          
          {/* Seats Available Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {availableSeats} seat{availableSeats !== 1 ? 's' : ''} left
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2 cursor-pointer" onClick={handleViewDetails}>
              {trip.title}
            </h3>
            <div className="text-right">
              <span className="text-sm font-medium text-green-600 block">₹{pricePerPerson.toLocaleString()}</span>
              <span className="text-xs text-gray-500">per person</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-pointer" onClick={handleViewDetails}>
            {trip.description || 'No description available'}
          </p>
          
          {/* Destination and Participants */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-3 flex items-center">
              📍 {trip.destination || 'Destination not set'}
            </span>
            <span className="flex items-center">
              👥 {currentParticipants}/{maxParticipants}
            </span>
          </div>
          
          {/* Dates */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>

          {/* Categories/Tags */}
          {trip.category && (
            <div className="flex flex-wrap gap-1 mb-3">
              {trip.category.split(',').map((cat, index) => (
                cat.trim() && (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {cat.trim()}
                  </span>
                )
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handleViewDetails}
              className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              View Details
            </button>
            
            {showJoinButton && (
              <>
                {userAlreadyJoined ? (
                  <button 
                    disabled
                    className="flex-1 bg-green-100 text-green-800 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                  >
                    ✓ Joined
                  </button>
                ) : isTripCreator ? (
                  <button 
                    disabled
                    className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                    title="You created this trip"
                  >
                    Your Trip
                  </button>
                ) : (
                  <button 
                    onClick={handleJoinClick}
                    disabled={!canJoin || joining}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      canJoin 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {joining ? 'Joining...' : availableSeats === 0 ? 'Full' : trip.status !== 'planned' ? 'Not Available' : 'Join Trip'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Join Trip Modal */}
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