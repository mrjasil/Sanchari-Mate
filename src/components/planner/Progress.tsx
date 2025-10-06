interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Connect' }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-200
                  ${currentStep >= step.number 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-2 font-medium transition-colors duration-200
                ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 transition-colors duration-200
                  ${currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}