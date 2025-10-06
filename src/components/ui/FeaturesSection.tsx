"use client";
import React from "react";
import { Calendar, Users, Shield, Camera, MapPin, Plus } from "lucide-react";

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-blue-600" />,
    title: "Smart Planning",
    description: "Create detailed itineraries with AI-powered suggestions and local insights.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Group Travel",
    description: "Collaborate with friends, split expenses, and plan together seamlessly.",
  },
  {
    icon: <Shield className="w-8 h-8 text-gray-600" />,
    title: "Travel Safe",
    description: "Emergency contacts, local information, and safety features in one place.",
  },
  {
    icon: <Camera className="w-8 h-8 text-blue-500" />,
    title: "Capture Memories",
    description: "Document your journey and create beautiful travel stories to share.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-green-500" />,
    title: "Discover Places",
    description: "Find hidden gems, local favorites, and must-visit attractions.",
  },
  {
    icon: <Plus className="w-8 h-8 text-gray-500" />,
    title: "Easy Booking",
    description: "Manage all your bookings, tickets, and reservations in one dashboard.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full bg-blue-100 py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need for <span className="text-blue-600">Perfect Trips</span>
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          From planning to memories, Trip Mate provides all the tools you need
          for stress-free and unforgettable travel experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;