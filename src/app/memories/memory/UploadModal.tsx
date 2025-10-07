// 'use client';

// import { useState } from 'react';
// import { MemoryFormData } from '@/types/memory';
// import { generateId } from '@/lib/utils';

// interface UploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUpload: (memory: any) => void;
// }

// export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
//   const [formData, setFormData] = useState<MemoryFormData>({
//     title: '',
//     description: '',
//     file: null,
//     type: 'photo',
//     location: '',
//     tags: ''
//   });

//   const [previewUrl, setPreviewUrl] = useState<string>('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, file }));
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const newMemory = {
//       id: generateId(),
//       title: formData.title,
//       description: formData.description,
//       imageUrl: previewUrl || '/images/default-memory.jpg',
//       type: formData.type,
//       date: new Date().toISOString(),
//       location: formData.location,
//       tags: formData.tags.split(',').map(tag => tag.trim()),
//       createdAt: new Date()
//     };

//     onUpload(newMemory);
//     handleClose();
//   };

//   const handleClose = () => {
//     setFormData({
//       title: '',
//       description: '',
//       file: null,
//       type: 'photo',
//       location: '',
//       tags: ''
//     });
//     setPreviewUrl('');
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Memory</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Memory Type
//             </label>
//             <select
//               value={formData.type}
//               onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="photo">Photo</option>
//               <option value="video">Video</option>
//               <option value="note">Note</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               rows={3}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Upload File
//             </label>
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             {previewUrl && formData.type === 'photo' && (
//               <img src={previewUrl} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover" />
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Location
//             </label>
//             <input
//               type="text"
//               value={formData.location}
//               onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tags (comma separated)
//             </label>
//             <input
//               type="text"
//               value={formData.tags}
//               onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="beach, sunset, vacation"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
//             >
//               Upload Memory
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }