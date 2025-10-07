// components/ui/ErrorState.tsx
import Link from 'next/link';

interface ErrorStateProps {
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{message}</h2>
        {action ? (
          <Link 
            href={action.href} 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {action.label}
          </Link>
        ) : (
          <Link href="/trips/all" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to All Trips
          </Link>
        )}
      </div>
    </div>
  );
}