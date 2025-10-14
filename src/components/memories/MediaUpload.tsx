'use client';

import { useState, useRef } from 'react';
import { showWarningAlert } from '@/lib/alertService';
import { Media } from '@/types/memory';

interface MediaUploadProps {
  onMediaSelect: (media: Media[]) => void;
  selectedMedia: Media[];
  className?: string;
}

export default function MediaUpload({ onMediaSelect, selectedMedia, className }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'note'>('photo');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    const newMedia: Media[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        showWarningAlert('Invalid file type', 'Please select only image or video files');
        continue;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showWarningAlert('File too large', 'Please select files smaller than 5MB');
        continue;
      }

      // Determine media type
      const type = file.type.startsWith('image/') ? 'image' as const : 'video' as const;
      
      newMedia.push({
        id: Date.now().toString() + Math.random(),
        type,
        url: URL.createObjectURL(file),
        file,
        caption: ''
      });
    }

    if (newMedia.length > 0) {
      onMediaSelect([...selectedMedia, ...newMedia]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddNote = () => {
    const noteMedia: Media = {
      id: Date.now().toString(),
      type: 'note',
      url: '',
      caption: ''
    };
    onMediaSelect([...selectedMedia, noteMedia]);
  };

  const removeMedia = (id: string) => {
    const updatedMedia = selectedMedia.filter(media => media.id !== id);
    onMediaSelect(updatedMedia);
  };

  const updateCaption = (id: string, caption: string) => {
    const updatedMedia = selectedMedia.map(media =>
      media.id === id ? { ...media, caption } : media
    );
    onMediaSelect(updatedMedia);
  };

  const handleClick = () => {
    if (activeTab !== 'note') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={activeTab === 'photo' ? 'image/*' : activeTab === 'video' ? 'video/*' : ''}
        multiple
        className="hidden"
      />
      
      {/* Media Type Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('photo')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'photo'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📸 Photos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'video'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🎥 Videos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('note')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'note'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📝 Notes
        </button>
      </div>

      {/* Upload Area */}
      <div
        onClick={handleClick}
        className={`border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/30 ${
          selectedMedia.length > 0 ? "min-h-32" : "h-48"
        } ${activeTab === 'note' ? 'cursor-default' : ''}`}
      >
        {selectedMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            {activeTab === 'note' ? (
              <>
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="font-medium text-lg">Add a Note</p>
                <p className="text-sm mt-1 text-center">Share your thoughts, experiences, or stories</p>
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium"
                >
                  Create Note
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-medium text-lg">Upload {activeTab === 'photo' ? 'Photos' : 'Videos'}</p>
                <p className="text-sm mt-1">Click to add {activeTab === 'photo' ? 'photos' : 'videos'}</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedMedia.map((media) => (
                <div key={media.id} className="relative group">
                  {media.type === 'image' && (
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={media.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {media.type === 'video' && (
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {media.type === 'note' && (
                    <div className="aspect-square rounded-xl overflow-hidden bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center p-3">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-yellow-800">Note</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeMedia(media.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                  >
                    ×
                  </button>
                  
                  <input
                    type="text"
                    value={media.caption || ''}
                    onChange={(e) => updateCaption(media.id, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
              
              {/* Add More Button */}
              <button
                type="button"
                onClick={activeTab === 'note' ? handleAddNote : handleClick}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">Add {activeTab === 'note' ? 'Note' : 'More'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}