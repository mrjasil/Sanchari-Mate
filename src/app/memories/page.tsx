// 'use client';

// import { useState } from 'react';
// import { Memory } from '@/types/memory';
// import MemoryCard from '@/components/ui/MemoryCard';
// import UploadModal from './components/UploadModal';
// import { useGSAPAnimations } from '@/hooks/useGSAPAnimations';

// // Mock data - replace with actual API calls
// const initialMemories: Memory[] = [
//   {
//     id: '1',
//     title: 'Sunset at Bali Beach',
//     description: 'Beautiful sunset view from our resort in Bali. The colors were absolutely breathtaking!',
//     imageUrl: '/images/bali-sunset.jpg',
//     type: 'photo',
//     date: '2024-01-15',
//     location: 'Bali, Indonesia',
//     tags: ['sunset', 'beach', 'vacation'],
//     createdAt: new Date('2024-01-15')
//   },
//   {
//     id: '2',
//     title: 'Mountain Hiking Adventure',
//     description: 'Amazing hike through the Swiss Alps. The view from the top was worth every step!',
//     imageUrl: '/images/alps-hike.jpg',
//     type: 'photo',
//     date: '2024-02-20',
//     location: 'Swiss Alps',
//     tags: ['hiking', 'mountains', 'adventure'],
//     createdAt: new Date('2024-02-20')
//   },
//   {
//     id: '3',
//     title: 'Tokyo City Lights',
//     description: 'The vibrant nightlife and amazing food in Tokyo made this trip unforgettable.',
//     imageUrl: '/images/tokyo-night.jpg',
//     type: 'photo',
//     date: '2024-03-10',
//     location: 'Tokyo, Japan',
//     tags: ['city', 'nightlife', 'food'],
//     createdAt: new Date('2024-03-10')
//   }
// ];

// export default function MemoriesPage() {
//   const [memories, setMemories] = useState<Memory[]>(initialMemories);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const { containerRef } = useGSAPAnimations();

//   const handleUploadMemory = (newMemory: Memory) => {
//     setMemories(prev => [newMemory, ...prev]);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="gallery-header text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             Trip Memories
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//             Relive your favorite travel moments. Upload photos, videos, and notes from your journeys.
//           </p>
//           <button
//             onClick={() => setIsUploadModalOpen(true)}
//             className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
//           >
//             <i className="fas fa-plus mr-2"></i>
//             Add New Memory
//           </button>
//         </div>

//         {/* Memories Grid */}
//         <div 
//           ref={containerRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//         >
//           {memories.map((memory, index) => (
//             <MemoryCard 
//               key={memory.id} 
//               memory={memory} 
//               index={index}
//             />
//           ))}
//         </div>

//         {/* Empty State */}
//         {memories.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl text-gray-300 mb-4">
//               <i className="fas fa-camera"></i>
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-600 mb-2">
//               No Memories Yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Start by uploading your first travel memory!
//             </p>
//             <button
//               onClick={() => setIsUploadModalOpen(true)}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
//             >
//               Upload First Memory
//             </button>
//           </div>
//         )}

//         {/* Upload Modal */}
//         <UploadModal
//           isOpen={isUploadModalOpen}
//           onClose={() => setIsUploadModalOpen(false)}
//           onUpload={handleUploadMemory}
//         />
//       </div>
//     </div>
//   );
// }