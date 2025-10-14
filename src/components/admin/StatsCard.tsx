'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  description?: string;
}

export default function StatsCard({ title, value, change, icon, description }: StatsCardProps) {
  const isPositive = change && change >= 0;
  const safeChange = change || 0;
  const safeValue = value || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{safeValue}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{safeChange}% from last month
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}