// components/ui/TripCard/TripCardSkeleton.tsx
export default function TripCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-52 bg-gray-300 relative flex-shrink-0"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-7 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-5 w-3/4"></div>
        
        <div className="space-y-3 mb-2">
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
        <div className="h-12 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}