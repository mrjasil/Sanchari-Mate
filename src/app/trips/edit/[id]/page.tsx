"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { tripAPI } from "@/lib/api";
import { Trip } from "@/types/Trip";
import { useAuthStore } from "@/store/authStore";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: 0,
    maxParticipants: 1,
    category: "",
    accommodation: "",
    transportation: "",
    meetupLocation: "",
    contactInfo: "",
    status: "planned" as "planned" | "ongoing" | "completed" | "cancelled",
    highlights: [] as string[],
    itinerary: [] as string[],
    tags: [] as string[],
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;

      setLoading(true);
      setError(null);
      try {
        const tripData = await tripAPI.getTrip(tripId);

        if (tripData) {
          setTrip(tripData);
          setFormData({
            title: tripData.title || "",
            destination: tripData.destination || "",
            description: tripData.description || "",
            startDate: tripData.startDate
              ? new Date(tripData.startDate).toISOString().split("T")[0]
              : "",
            endDate: tripData.endDate
              ? new Date(tripData.endDate).toISOString().split("T")[0]
              : "",
            budget: tripData.budget || 0,
            maxParticipants: tripData.maxParticipants || 1,
            category: tripData.category || "",
            accommodation: tripData.accommodation || "",
            transportation: tripData.transportation || "",
            meetupLocation: tripData.meetupLocation || "",
            contactInfo: tripData.contactInfo || "",
            status: tripData.status || "planned",
            highlights: tripData.highlights || [],
            itinerary: tripData.itinerary || [],
            tags: tripData.tags || [],
            image: tripData.image || "",
          });
          setImagePreview(tripData.image || "/images/default-trip.jpg");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: value }));
      setImagePreview(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "budget" || name === "maxParticipants" ? Number(value) : value,
      }));
    }
  };

  const handleArrayFieldChange = (field: "highlights" | "itinerary" | "tags", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayFieldItem = (field: "highlights" | "itinerary" | "tags") => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayFieldItem = (field: "highlights" | "itinerary" | "tags", index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        highlights: formData.highlights.filter(item => item.trim() !== ""),
        itinerary: formData.itinerary.filter(item => item.trim() !== ""),
        tags: formData.tags.filter(item => item.trim() !== ""),
        image: formData.image || "/images/default-trip.jpg",
      };

      await tripAPI.updateTrip(trip.id, submitData);
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      console.error(error);
      setError("Failed to update trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => router.back();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !trip) return <div className="min-h-screen flex items-center justify-center">{error || "Trip not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleCancel} className="text-blue-500 hover:text-blue-600">← Cancel</button>
          <h1 className="text-3xl font-bold">Edit Trip</h1>
          <div className="w-20" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Destination</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded px-2 py-1" rows={3} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full border rounded px-2 py-1" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Budget</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Max Participants</label>
              <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URL / Upload</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="w-full border rounded px-2 py-1 mb-2" placeholder="Enter image URL" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-2" />
            {imagePreview && <Image src={imagePreview} alt="Preview" width={300} height={200} className="rounded border" />}
          </div>

          {/* Array Fields */}
          {["highlights", "itinerary", "tags"].map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {formData[field as "highlights" | "itinerary" | "tags"].map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayFieldChange(field as any, i, e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button type="button" onClick={() => removeArrayFieldItem(field as any, i)} className="bg-red-500 text-white px-2 rounded">X</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayFieldItem(field as any)} className="bg-blue-500 text-white px-3 py-1 rounded">Add {field.slice(0, -1)}</button>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
