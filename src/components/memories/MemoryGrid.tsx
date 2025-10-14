'use client';

import { useState } from 'react';
import { Memory, Review } from '@/types/memory';
import MemoryCard from './MemoryCard';
import AddMemoryModal from './AddMemoryModal';
import Link from 'next/link';

export default function MemoryGrid() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMemory = (memoryData: Omit<Memory, 'id' | 'reviews' | 'likes' | 'createdAt'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: Date.now().toString(),
      reviews: [],
      likes: [],
      createdAt: new Date().toISOString(),
      userId: 'user-1', // Default user ID since no auth
      userName: 'Traveler' // Default username
    };
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      setMemories(prev => prev.filter(memory => memory.id !== id));
    }
  };

  const handleAddReview = (memoryId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };

    setMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? { ...memory, reviews: [...memory.reviews, newReview] }
        : memory
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Travel Memories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Capture and share your travel experiences with photos, videos, and notes. Relive your adventures and inspire others.
          </p>
          
          {/* Welcome Message */}
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Share your travel memories with everyone!
          </div>
        </div>

        {/* Add Memory Button - Always show since no auth */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 px-8 py-4 hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-lg">Share New Memory</div>
                <div className="text-gray-500 text-sm">Upload photos, videos, or add notes from your trips</div>
              </div>
            </div>
          </button>
        </div>

        {/* Memories Grid */}
        {memories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onDelete={handleDeleteMemory}
                onAddReview={handleAddReview}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No memories yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Start sharing your travel moments! Add your first memory with photos, videos, or notes.
            </p>
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMemory}
      />
    </div>
  );
}