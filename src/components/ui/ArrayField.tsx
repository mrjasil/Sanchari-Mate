interface ArrayFieldProps {
  items: string[];
  fieldName: "highlights" | "itinerary" | "tags";
  placeholder: string;
  onItemChange: (field: "highlights" | "itinerary" | "tags", index: number, value: string) => void;
  onAddItem: (field: "highlights" | "itinerary" | "tags") => void;
  onRemoveItem: (field: "highlights" | "itinerary" | "tags", index: number) => void;
}

export default function ArrayField({
  items,
  fieldName,
  placeholder,
  onItemChange,
  onAddItem,
  onRemoveItem
}: ArrayFieldProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onItemChange(fieldName, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => onRemoveItem(fieldName, index)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => onAddItem(fieldName)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add {fieldName.slice(0, -1)}
      </button>
    </div>
  );
}