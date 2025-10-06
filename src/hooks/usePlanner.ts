import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { tripAPI } from '@/lib/api';
import { TripFormData } from '@/types/Trip';

const defaultFormData: TripFormData = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  travelers: 1,
  budget: '',
  interests: '',
  description: '',
  category: '',
  difficulty: 'easy',
  accommodation: '',
  transportation: '',
  isPublic: true,
  meetupLocation: '',
  contactInfo: '',
  highlights: '',
  image: '',
  pricePerPerson: 0,
  advancePaymentPercentage: 0,
  tags: '',
  requirements: ''
};

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const usePlanner = () => {
  const { user, isAuthenticated, updateUserTrips } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState<TripFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Trip title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    if (formData.travelers < 1) {
      newErrors.travelers = 'Must have at least 1 traveler';
    } else if (formData.travelers > 20) {
      newErrors.travelers = 'Maximum 20 travelers allowed';
    }
    
    if (formData.budget && Number(formData.budget) < 0) {
      newErrors.budget = 'Budget cannot be negative';
    }
    
    const selectedCategories = formData.category ? formData.category.split(',').filter(c => c !== '') : [];
    if (selectedCategories.length === 0) {
      newErrors.category = 'At least one category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Trip description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }
    
    if (formData.highlights) {
      const highlightsArray = formData.highlights.split(',').map(h => h.trim()).filter(Boolean);
      if (highlightsArray.length < 2) {
        newErrors.highlights = 'Please provide at least 2 highlights';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.meetupLocation.trim()) {
      newErrors.meetupLocation = 'Meetup location is required';
    } else if (formData.meetupLocation.trim().length < 3) {
      newErrors.meetupLocation = 'Meetup location must be at least 3 characters';
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      let isValid = false;
      
      switch (currentStep) {
        case 1:
          isValid = validateStep1();
          break;
        case 2:
          isValid = validateStep2();
          break;
        case 3:
          isValid = validateStep3();
          break;
        default:
          isValid = true;
      }

      if (isValid) {
        setCurrentStep(Math.min(currentStep + 1, 3));
        setErrors({});
      }
    } else {
      setCurrentStep(Math.max(currentStep - 1, 1));
      setErrors({});
    }
  };

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => {
      const currentCategories = prev.category ? prev.category.split(',') : [];
      
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          category: currentCategories.filter(c => c !== category).join(',')
        };
      } else {
        return {
          ...prev,
          category: [...currentCategories, category].join(',')
        };
      }
    });
    
    if (errors.category) {
      const newErrors = { ...errors };
      delete newErrors.category;
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Please login to create a trip');
      router.push('/login');
      return;
    }

    if (currentStep === 3 && !validateStep3()) {
      alert('Please fix all validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const tripData = {
        id: generateId(),
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxParticipants: Number(formData.travelers),
        budget: formData.budget ? Number(formData.budget) : 0,
        interests: formData.interests,
        status: 'planned' as const,
        image: formData.image || '/images/default-trip.jpg',
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        accommodation: formData.accommodation,
        transportation: formData.transportation,
        isPublic: formData.isPublic,
        meetupLocation: formData.meetupLocation,
        contactInfo: formData.contactInfo,
        highlights: formData.highlights.split(',').map(h => h.trim()).filter(Boolean),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        itinerary: [],
        participants: [user.id],
        availableSeats: Number(formData.travelers),
        pricePerPerson: formData.pricePerPerson || 0,
        advancePaymentPercentage: formData.advancePaymentPercentage || 20,
        currentParticipants: 0,
        joinedUsers: [],
        updatedAt: new Date().toISOString(),
      };

      const newTrip = await tripAPI.createTrip(tripData);
      
      const updatedUserTrips = [...(user.trips || []), newTrip.id];
      await tripAPI.updateTrip(user.id, updatedUserTrips);
      updateUserTrips(updatedUserTrips);
      
      setFormData(defaultFormData);
      setCurrentStep(1);
      setErrors({});
      
      alert('🎉 Trip created successfully! The trip has been added to your profile.');
      router.push(`/trips/${newTrip.id}`);
      
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('❌ Error creating trip. Please try again. Check if JSON server is running.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    currentStep,
    errors,
    loading,
    handleStepChange,
    handleFormSubmit,
    updateFormData,
    handleCategorySelect,
    handleImageUpload
  };
};