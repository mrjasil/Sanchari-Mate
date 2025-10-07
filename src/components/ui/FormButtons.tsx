interface FormButtonsProps {
  onCancel: () => void;
  submitLabel: string;
  disabled?: boolean;
}

export default function FormButtons({ onCancel, submitLabel, disabled = false }: FormButtonsProps) {
  return (
    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {submitLabel}
      </button>
    </div>
  );
}