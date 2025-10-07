// components/ui/TripCard/TripCard.tsx
"use client";

import { Trip } from "@/types/Trip";
import { useState } from "react";
import TripCardImage from "./TripCardImage";
import TripCardContent from "./TripCardContent";
import TripCardActions from "./TripCardAction";
import TripCardSkeleton from "./TripCardSkeleton";

export interface TripCardProps {
  trip: Trip | undefined;
  onEdit?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
  onJoin?: (trip: Trip) => Promise<void>;
  onJoinError?: (error: string) => void; // New prop for error handling
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showJoinButton?: boolean;
  showViewDetailsButton?: boolean;
  currentUserId?: string;
  forceShowActions?: boolean;
  userAlreadyJoined?: boolean;
}

export default function TripCard({ 
  trip, 
  onEdit, 
  onDelete, 
  onJoin,
  onJoinError, // Add error handler
  showEditButton = true, 
  showDeleteButton = true,
  showJoinButton = false,
  showViewDetailsButton = true,
  currentUserId,
  forceShowActions = false,
  userAlreadyJoined = false
}: TripCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  // Handle join errors
  const handleJoinError = (error: string) => {
    console.error('Join trip error:', error);
    onJoinError?.(error);
    setJoinLoading(false);
  };

  if (!trip) {
    return <TripCardSkeleton />;
  }

  const shouldShowActions = forceShowActions || currentUserId === trip.creatorId;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Trip Image */}
      <TripCardImage
        trip={trip}
        imageError={imageError}
        imageLoading={imageLoading}
        currentUserId={currentUserId}
        onImageLoad={() => setImageLoading(false)}
        onImageError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />

      {/* Trip Content */}
      <TripCardContent trip={trip} />

      {/* Action Buttons */}
      <TripCardActions
        trip={trip}
        shouldShowActions={shouldShowActions}
        showEditButton={showEditButton}
        showDeleteButton={showDeleteButton}
        showJoinButton={showJoinButton}
        showViewDetailsButton={showViewDetailsButton}
        userAlreadyJoined={userAlreadyJoined}
        joinLoading={joinLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        onJoin={onJoin}
        onJoinLoadingChange={setJoinLoading}
        onJoinError={handleJoinError}
      />
    </div>
  );
}