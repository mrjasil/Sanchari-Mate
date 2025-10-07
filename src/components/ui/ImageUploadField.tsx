"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageUploadFieldProps {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
}

export default function ImageUploadField({ imageUrl, onImageUrlChange }: ImageUploadFieldProps) {
  const [imagePreview, setImagePreview] = useState<string>(imageUrl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageUrlChange(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => {
          onImageUrlChange(e.target.value);
          setImagePreview(e.target.value);
        }}
        placeholder="Enter image URL"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or upload an image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {imagePreview && (
        <div className="mt-2">
          <Image 
            src={imagePreview} 
            alt="Preview" 
            width={300} 
            height={200} 
            className="rounded-lg border border-gray-300 object-cover"
          />
        </div>
      )}
    </div>
  );
}