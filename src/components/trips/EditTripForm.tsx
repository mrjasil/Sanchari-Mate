"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@/types/Trip";
import { tripAPI } from "@/lib/api";
import FormHeader from "@/components/ui/FormHeader";
import FormSection from "@/components/ui/FormSection";
import InputField from "@/components/ui/InputField";
import TextAreaField from "@/components/ui/TextAreaField";
import DateField from "@/components/ui/DateField";
import NumberField from "@/components/ui/NumberField";
import ImageUploadField from "@/components/ui/ImageUploadField";
import ArrayField from "@/components/ui/ArrayField";
import FormButtons from "@/components/ui/FormButtons";

interface EditTripFormProps {
  trip: Trip;
}

export default function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: trip.title || "",
    destination: trip.destination || "",
    description: trip.description || "",
    startDate: trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "",
    endDate: trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
    budget: trip.budget || 0,
    maxParticipants: trip.maxParticipants || 1,
    category: trip.category || "",
    accommodation: trip.accommodation || "",
    transportation: trip.transportation || "",
    meetupLocation: trip.meetupLocation || "",
    contactInfo: trip.contactInfo || "",
    status: trip.status || "planned" as "planned" | "ongoing" | "completed" | "cancelled",
    highlights: trip.highlights || [],
    itinerary: trip.itinerary || [],
    tags: trip.tags || [],
    image: trip.image || "",
    isPublic: trip.isPublic !== undefined ? trip.isPublic : true, // Make sure this is included
  });

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        highlights: formData.highlights.filter(item => item.trim() !== ""),
        itinerary: formData.itinerary.filter(item => item.trim() !== ""),
        tags: formData.tags.filter(item => item.trim() !== ""),
        image: formData.image || "/images/default-trip.jpg",
        // Ensure these fields are included for proper filtering
        availableSeats: trip.availableSeats || trip.maxParticipants,
        currentParticipants: trip.currentParticipants || 0,
        joinedUsers: trip.joinedUsers || [],
        participants: trip.participants || [],
      };

      await tripAPI.updateTrip(trip.id, submitData);
      
      // Force refresh by navigating to the trip details page
      // This ensures both My Trips and All Trips will show updated data
      router.push(`/trips/${trip.id}`);
      router.refresh(); // Refresh the current route
      
    } catch (error) {
      console.error(error);
      setError("Failed to update trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FormHeader 
          title="Edit Trip" 
          onCancel={handleCancel} 
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Basic Information */}
          <FormSection title="Basic Information">
            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </FormSection>

          {/* Dates */}
          <FormSection title="Dates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              <DateField
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </FormSection>

          {/* Budget & Participants */}
          <FormSection title="Budget & Participants">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberField
                label="Budget (₹)"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min={0}
              />
              <NumberField
                label="Max Participants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min={1}
              />
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Beach, Adventure, Cultural"
              />
              <InputField
                label="Accommodation"
                name="accommodation"
                value={formData.accommodation}
                onChange={handleInputChange}
                placeholder="e.g., Hotel, Hostel, Camping"
              />
              <InputField
                label="Transportation"
                name="transportation"
                value={formData.transportation}
                onChange={handleInputChange}
                placeholder="e.g., Flight, Train, Bus"
              />
              <InputField
                label="Meetup Location"
                name="meetupLocation"
                value={formData.meetupLocation}
                onChange={handleInputChange}
                placeholder="Where will you meet?"
              />
            </div>
            <InputField
              label="Contact Information"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="Phone number or email for participants to contact"
            />
          </FormSection>

          {/* Privacy Setting */}
          <FormSection title="Privacy">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Make this trip public (visible to all users)
              </label>
            </div>
          </FormSection>

          {/* Image */}
          <FormSection title="Trip Image">
            <ImageUploadField
              imageUrl={formData.image}
              onImageUrlChange={(value) => handleInputChange("image", value)}
            />
          </FormSection>

          {/* Array Fields */}
          <FormSection title="Trip Highlights">
            <ArrayField
              items={formData.highlights}
              fieldName="highlights"
              placeholder="Enter a trip highlight"
              onItemChange={handleArrayFieldChange}
              onAddItem={addArrayFieldItem}
              onRemoveItem={removeArrayFieldItem}
            />
          </FormSection>

          <FormSection title="Itinerary">
            <ArrayField
              items={formData.itinerary}
              fieldName="itinerary"
              placeholder="Enter itinerary item"
              onItemChange={handleArrayFieldChange}
              onAddItem={addArrayFieldItem}
              onRemoveItem={removeArrayFieldItem}
            />
          </FormSection>

          <FormSection title="Tags">
            <ArrayField
              items={formData.tags}
              fieldName="tags"
              placeholder="Enter a tag"
              onItemChange={handleArrayFieldChange}
              onAddItem={addArrayFieldItem}
              onRemoveItem={removeArrayFieldItem}
            />
          </FormSection>

          {/* Status */}
          <FormSection title="Trip Status">
            <select
              name="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormSection>

          <FormButtons
            onCancel={handleCancel}
            submitLabel={saving ? "Saving..." : "Save Changes"}
            disabled={saving}
          />
        </form>
      </div>
    </div>
  );
}