interface TripStatusBadgeProps {
  status: string;
}

export default function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Planned'}
    </span>
  );
}