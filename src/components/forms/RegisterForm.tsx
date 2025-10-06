'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) return 'This field is required';
        if (value.length < 2) return 'Must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof typeof formErrors] && touched[name as keyof typeof touched]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }

    if (error) clearError();

    if (name === 'password' && formData.confirmPassword) {
      setFormErrors(prev => ({ 
        ...prev, 
        confirmPassword: validateField('confirmPassword', formData.confirmPassword) 
      }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelPhoto = () => {
    setProfileImage(null);
    setProfilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    setFormErrors(errors);
    setTouched({ 
      firstName: true, 
      lastName: true, 
      email: true, 
      password: true, 
      confirmPassword: true 
    });
    
    return !errors.firstName && !errors.lastName && !errors.email && 
           !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      let profilePic = undefined;
      
      if (profileImage) {
        profilePic = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(profileImage);
        });
      } else {
        profilePic = '/images/default-avatar.jpg';
      }

      await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName, 
        profilePic
      );
      
      router.push('/trips');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.password && formData.confirmPassword && 
                     !formErrors.firstName && !formErrors.lastName && !formErrors.email && 
                     !formErrors.password && !formErrors.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4">
        
        {/* Left Side - Branding */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">Sanchari Mate</h1>
          <p className="text-xl md:text-2xl text-gray-800">
            Connect with travelers and share your adventures around the world.
          </p>
          
          {/* Success Stories */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Join our travel community!</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>✓ Plan trips with fellow travelers</p>
              <p>✓ Share expenses and memories</p>
              <p>✓ Discover amazing destinations</p>
              <p>✓ Connect with like-minded adventurers</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create a New Account</h2>
              <p className="text-gray-600">Join our travel community today!</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {error}
                {error.includes('already exists') && (
                  <div className="mt-1">
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Click here to login instead
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Profile Photo Upload */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center mx-auto">
                    {profilePreview ? (
                      <Image
                        src={profilePreview}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">
                        {formData.firstName ? formData.firstName[0].toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  
                  {!profilePreview && (
                    <button
                      type="button"
                      onClick={handleAddPhotoClick}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add Profile Photo
                    </button>
                  )}

                  {profilePreview && (
                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleAddPhotoClick}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelPhoto}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        title="Remove photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {profilePreview && (
                  <p className="text-xs text-green-600 mt-2">Profile photo added ✓</p>
                )}
                
                <p className="text-xs text-gray-500 mt-1">Optional - You can add one later</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      touched.firstName && formErrors.firstName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    required
                  />
                  {touched.firstName && formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      touched.lastName && formErrors.lastName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    required
                  />
                  {touched.lastName && formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    touched.email && formErrors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {touched.email && formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    touched.password && formErrors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {touched.password && formErrors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    touched.confirmPassword && formErrors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {touched.confirmPassword && formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                  isFormValid && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-400 text-white cursor-not-allowed'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              {/* Terms and Conditions */}
              <div className="text-center text-xs text-gray-500">
                <p>By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.</p>
              </div>

              {/* Already have account link */}
              <div className="text-center pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}