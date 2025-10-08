'use client';

import { useState } from 'react';
import { Memory, Review } from '@/types/memory';
import { useAuth } from '@/lib/auth';

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string) => void;
  onAddReview: (memoryId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function MemoryCard({ memory, onDelete, onAddReview }: MemoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user, isAuthenticated } = useAuth();

  const isOwner = memory.userId === user?.id;

  const handleDownload = async () => {
    try {
      const response = await fetch(memory.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `memory-${memory.title}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    }
  };

  const handleAddReview = () => {
    if (!isAuthenticated || !user) {
      alert('Please login to add a review');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    onAddReview(memory.id, {
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setNewReview({ rating: 5, comment: '' });
  };

  const averageRating = memory.reviews.length > 0 
    ? memory.reviews.reduce((sum, review) => sum + review.rating, 0) / memory.reviews.length
    : 0;

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={memory.image}
          alt={memory.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-blue-600 shadow-lg"
            title="Download image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          {/* Delete Button - Only for owner */}
          {isOwner && (
            <button
              onClick={() => onDelete(memory.id)}
              className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-lg"
              title="Delete memory"
            >
              ×
            </button>
          )}
        </div>

        {/* Reviews Badge */}
        {memory.reviews.length > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            ⭐ {averageRating.toFixed(1)} ({memory.reviews.length})
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-1 flex-1">
            {memory.title}
          </h3>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="ml-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            {showReviews ? 'Hide' : 'Reviews'}
          </button>
        </div>
        
        {memory.notes && (
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {memory.notes}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>By {memory.userName}</span>
          <span>{new Date(memory.date).toLocaleDateString()}</span>
        </div>

        {/* Location */}
        {memory.location && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {memory.location}
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <div className="border-t pt-4 mt-4">
            {/* Add Review Form */}
            {isAuthenticated && (
              <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-3">Add Your Review</h4>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      {star <= newReview.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{newReview.rating}/5</span>
                </div>

                {/* Review Comment */}
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this memory..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                />

                <button
                  onClick={handleAddReview}
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {memory.reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">{review.userName}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {memory.reviews.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}