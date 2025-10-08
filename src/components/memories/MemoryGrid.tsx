'use client';

import { useState } from 'react';
import { Memory, Review } from '@/types/memory';
import { useAuth } from '@/lib/auth';
import MemoryCard from './MemoryCard';
import AddMemoryModal from './AddMemoryModal';
import Link from 'next/link';

export default function MemoryGrid() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleAddMemory = (memoryData: Omit<Memory, 'id' | 'reviews' | 'likes'>) => {
    if (!isAuthenticated || !user) return;

    const newMemory: Memory = {
      ...memoryData,
      id: Date.now().toString(),
      reviews: [],
      likes: [],
      userId: user.id,
      userName: user.name
    };
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    if (!isAuthenticated || !user) return;

    const memory = memories.find(m => m.id === id);
    if (memory && memory.userId !== user.id) {
      alert('You can only delete your own memories');
      return;
    }

    if (confirm('Are you sure you want to delete this memory?')) {
      setMemories(prev => prev.filter(memory => memory.id !== id));
    }
  };

  const handleAddReview = (memoryId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    if (!isAuthenticated || !user) return;

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
        {/* Header with Auth Info */}
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
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Hi, {user?.name || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Memories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Photos and notes from your trips. Capture every special moment and revisit your adventures.
          </p>
          
          {/* Auth Status */}
          <div className="mt-4">
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Logged in as {user?.name || 'User'}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Please login to upload memories and add reviews
              </div>
            )}
          </div>
        </div>

        {/* Add Memory Button - Only show if authenticated */}
        {isAuthenticated && (
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
                  <div className="font-semibold text-gray-900 text-lg">Add New Memory</div>
                  <div className="text-gray-500 text-sm">Upload photos from your trips</div>
                </div>
              </div>
            </button>
          </div>
        )}

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
              {isAuthenticated ? 'No memories yet' : 'Welcome to Memories'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {isAuthenticated 
                ? 'Start capturing your travel moments! Add your first memory by clicking the button above.'
                : 'Please login to start sharing your travel memories and experiences.'
              }
            </p>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 font-medium inline-block"
              >
                Sign In to Get Started
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Add Memory Modal - Protected */}
      {isAuthenticated && (
        <AddMemoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddMemory}
        />
      )}
    </div>
  );
}