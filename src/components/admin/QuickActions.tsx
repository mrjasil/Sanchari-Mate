export default function QuickActions() {
  const actions = [
    { label: 'Add User', icon: '➕', href: '/admin/users/add' },
    { label: 'View Reports', icon: '📊', href: '/admin/reports' },
    { label: 'Manage Trips', icon: '✈️', href: '/admin/trips' },
    { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl block mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}