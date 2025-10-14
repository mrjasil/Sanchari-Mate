'use client';

import { useState } from 'react';
import { showErrorAlert, showWarningAlert } from '@/lib/alertService';
import { Memory, Media } from '@/types/memory';
import MediaUpload from './MediaUpload';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id' | 'reviews' | 'likes' | 'createdAt'>) => void;
}

export default function AddMemoryModal({ isOpen, onClose, onSave }: AddMemoryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaSelect = (media: Media[]) => {
    setSelectedMedia(media);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMedia.length === 0) {
      showWarningAlert('Media required', 'Please add at least one photo, video, or note');
      return;
    }

    if (!formData.title.trim()) {
      showWarningAlert('Title required', 'Please add a title for your memory');
      return;
    }

    setIsLoading(true);

    try {
      // Process media files and create URLs
      const processedMedia = await Promise.all(
        selectedMedia.map(async (media) => {
          let url = media.url;
          
          // If it's a new file, create object URL
          if (media.file) {
            url = URL.createObjectURL(media.file);
          }

          return {
            ...media,
            url,
            // Remove file object to avoid serialization issues
            file: undefined
          };
        })
      );

      const newMemory: Omit<Memory, 'id' | 'reviews' | 'likes' | 'createdAt'> = {
        ...formData,
        description: formData.description,
        media: processedMedia,
        date: formData.date,
        userId: 'user-1',
        userName: 'Traveler',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      onSave(newMemory);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving memory:', error);
      showErrorAlert('Save failed', 'Error saving memory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      tags: ''
    });
    setSelectedMedia([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-blue-50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Share Your Memory</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              type="button"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <MediaUpload
              onMediaSelect={handleMediaSelect}
              selectedMedia={selectedMedia}
              className="w-full"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give this memory a title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell the story behind this memory..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Where was this memory made?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="beach, sunset, family, adventure..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || selectedMedia.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-blue-500/25"
              >
                {isLoading ? 'Saving...' : 'Share Memory'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}