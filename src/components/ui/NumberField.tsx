interface NumberFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  min?: number;
  required?: boolean;
}

export default function NumberField({
  label,
  name,
  value,
  onChange,
  min = 0,
  required = false
}: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        min={min}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}