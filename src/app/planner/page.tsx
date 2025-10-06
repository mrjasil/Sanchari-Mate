'use client';
import { usePlanner } from '@/hooks/usePlanner';
import PlannerHeader from '@/components/planner/Header';
import ProgressIndicator from '@/components/planner/Progress';
import Step1Basic from '@/components/planner/Step1Basic';
import Step2Details from '@/components/planner/Step2Details';
import Step3Connect from '@/components/planner/Step3Connect';
import StepNavigation from '@/components/planner/StepNav';

export default function PlannerPage() {
  const {
    formData,
    currentStep,
    errors,
    loading,
    handleStepChange,
    handleFormSubmit,
    updateFormData,
    handleCategorySelect,
    handleImageUpload
  } = usePlanner();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Basic 
            formData={formData} 
            errors={errors}
            onInputChange={updateFormData}
            onCategorySelect={handleCategorySelect}
          />
        );
      case 2:
        return (
          <Step2Details 
            formData={formData} 
            errors={errors}
            onInputChange={updateFormData}
          />
        );
      case 3:
        return (
          <Step3Connect 
            formData={formData} 
            errors={errors}
            onInputChange={updateFormData}
            onImageUpload={handleImageUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PlannerHeader />
      <ProgressIndicator currentStep={currentStep} />
      
      <form onSubmit={handleFormSubmit}>
        {renderStep()}
        <StepNavigation 
          currentStep={currentStep}
          onStepChange={handleStepChange}
          loading={loading}
          errors={errors}
        />
      </form>
    </div>
  );
}