"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { tripAPI } from "@/lib/api";
import { Trip } from "@/types/Trip";
import { useAuthStore } from "@/store/authStore";
import EditTripForm from "@/components/trips/EditTripForm";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuthStore();

  // ADD THIS FUNCTION - Check if editing is allowed
  const canEditTrip = (tripData: Trip) => {
    if (!user || !tripData) return false;
    
    const isCreator = tripData.userId === user.id || tripData.createdBy === user.id;
    if (!isCreator) return false;
    
    if (tripData.status === 'completed' || tripData.status === 'cancelled') return false;
    
    // Can edit until the trip ends
    const tripEndDate = new Date(tripData.endDate);
    const today = new Date();
    return today <= tripEndDate;
  };

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;

      setLoading(true);
      setError(null);
      try {
        const tripData = await tripAPI.getTrip(tripId);
        if (tripData) {
          // Check if editing is allowed
          if (!canEditTrip(tripData)) {
            setError("You cannot edit this trip. Editing is only allowed until the trip end date and for trips that are not completed or cancelled.");
            setLoading(false);
            return;
          }
          
          setTrip(tripData);
        } else {
          setError("Trip not found");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchTrip();
  }, [tripId]);

  const isTripCreator = user && trip && (trip.userId === user.id || trip.createdBy === user.id);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/login");
    else if (trip && !isTripCreator) router.push("/trips");
  }, [loading, isAuthenticated, isTripCreator, trip, router]);

  if (loading) return <LoadingState message="Loading trip..." />;
  if (error || !trip) return <ErrorState message={error || "Trip not found"} />;

  return <EditTripForm trip={trip} />;
}