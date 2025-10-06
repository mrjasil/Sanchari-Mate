'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  // Validation function
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
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
    
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    if (formErrors[name as keyof typeof formErrors] && touched[name as keyof typeof touched]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }

    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };
    
    setFormErrors(errors);
    setTouched({ email: true, password: true });
    
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      // Error handled by store
    }
  };

  const isFormValid = email && password && !formErrors.email && !formErrors.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4">
        
        {/* Left Side - Branding */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">Sanchari Mate</h1>
          <p className="text-xl md:text-2xl text-gray-800">
            Sanchari Mate helps you connect and share with travelers around the world.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
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

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-3 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFormValid && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-400 text-white cursor-not-allowed'
                }`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-blue-600 text-sm hover:underline">
                  Forgotten password?
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 pt-4">
                <Link
                  href="/register"
                  className="block w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center hover:bg-green-600 transition-colors"
                >
                  Create New Account
                </Link>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="text-center text-xs text-gray-600 pt-4 border-t">
              <p>Demo credentials: demo@trip-mate.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}