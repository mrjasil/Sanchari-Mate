export default function DashboardStats() {
  const stats = [
    { label: 'Total Customers', value: '1,234', icon: '👥', color: 'bg-blue-500' },
    { label: "Today's Bookings", value: '89', icon: '📅', color: 'bg-green-500' },
    { label: 'Revenue', value: '$12,456', icon: '💰', color: 'bg-purple-500' },
    { label: 'Average Rating', value: '4.8', icon: '⭐', color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm flex items-center gap-4">
          <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
            {stat.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}