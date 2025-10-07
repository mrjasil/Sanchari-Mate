interface FormHeaderProps {
  title: string;
  onCancel: () => void;
}

export default function FormHeader({ title, onCancel }: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <button 
        onClick={onCancel} 
        className="flex items-center text-blue-500 hover:text-blue-600 font-medium"
      >
        ← Cancel
      </button>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <div className="w-20" />
    </div>
  );
}