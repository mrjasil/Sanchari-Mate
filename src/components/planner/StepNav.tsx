interface StepNavigationProps {
  currentStep: number;
  onStepChange: (direction: 'next' | 'prev') => void;
  loading: boolean;
  errors: Record<string, string>;
}

export default function StepNavigation({ currentStep, onStepChange, loading, errors }: StepNavigationProps) {
  const nextStep = () => onStepChange('next');
  const prevStep = () => onStepChange('prev');

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !errors.title && !errors.destination && !errors.startDate && !errors.endDate && !errors.travelers && !errors.category;
      case 2:
        return !errors.description && !errors.highlights;
      case 3:
        return Object.keys(errors).length === 0;
      default:
        return true;
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Previous
        </button>
      )}
      
      {currentStep < 3 ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={!isStepValid()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading || !isStepValid()}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🚀 Creating Trip...' : '🎉 Create Trip'}
        </button>
      )}
    </div>
  );
}