'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function UserProfileDropdown({ mobileView = false, onItemClick = () => {} }) {
  const [avatarError, setAvatarError] = useState(false); 
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, updateProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProfilePic(event.target?.result as string);
        setAvatarError(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (newProfilePic) {
      updateProfile({ profilePic: newProfilePic });
      setShowProfileModal(false);
      setNewProfilePic('');
      setAvatarError(false); 
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push('/');
  };


  const getUserInitials = () => {
    if (!user?.firstName) return 'U';
    return user.firstName.charAt(0).toUpperCase();
  };


  useEffect(() => {
    if (showProfileModal) {
      setAvatarError(false);
    }
  }, [showProfileModal]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 focus:outline-none transition-all duration-300 hover:scale-105 group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 backdrop-blur-sm group-hover:border-gray-400 transition-all duration-300 shadow-lg">
            
            {avatarError || !user?.profilePic ? (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-lg">
                {getUserInitials()}
              </div>
            ) : (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setAvatarError(true)}
              />
            )}
          </div>
          {!mobileView && (
            <span className="text-gray-800 font-semibold bg-gray-100/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-300 hover:bg-gray-200 transition-all duration-300">
              Hello, {user?.firstName}
            </span>
          )}
        </button>

        {isOpen && (
          <div className={`absolute ${mobileView ? 'static' : 'right-0 mt-3'} w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-3 z-50 border border-gray-200`}>
            <div className="px-4 py-3 border-b border-gray-200/50 mb-2">
              <p className="text-gray-800 font-semibold text-sm">🌟 Welcome back!</p>
              <p className="text-gray-600 text-xs">{user?.email}</p>
            </div>
            
            <button
              onClick={() => {
                setShowProfileModal(true);
                setIsOpen(false);
                onItemClick();
              }}
              className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 transition-all duration-300 hover:translate-x-2 group"
            >
              <span className="mr-3 text-lg">🎨</span>
              <div>
                <div className="font-medium">Customize Profile</div>
                <div className="text-gray-600 text-xs">Update your photo</div>
              </div>
            </button>
            
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setIsOpen(false);
                onItemClick();
              }}
              className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-300 hover:translate-x-2 group"
            >
              <span className="mr-3 text-lg">🚀</span>
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-gray-600 text-xs">See you soon!</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md border border-gray-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-200">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Profile Picture</h3>
              <p className="text-gray-600 text-sm">Make your profile stand out with a new photo</p>
            </div>

            <div className="text-center mb-8">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full blur-lg"></div>
                <div className="relative w-40 h-40 rounded-full bg-white backdrop-blur-sm overflow-hidden border-4 border-gray-200 shadow-2xl">
                  {/* ✅ UPDATED PROFILE PREVIEW WITH ERROR HANDLING */}
                  {newProfilePic ? (
                    <img 
                      src={newProfilePic} 
                      alt="New Profile" 
                      className="w-full h-full object-cover"
                      onError={() => console.log('Error loading new profile pic')}
                    />
                  ) : avatarError || !user?.profilePic ? (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-3xl">
                      {getUserInitials()}
                    </div>
                  ) : (
                    <img
                      src={user.profilePic}
                      alt="Current Profile"
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  )}
                </div>
              </div>

              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-800 px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-gray-300 hover:border-gray-400 hover:scale-105 shadow-lg">
                  <span className="text-lg mr-2">📁</span>
                  Choose New Photo
                </div>
              </label>
              
              {newProfilePic && (
                <div className="mt-4 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-sm border border-green-200 rounded-xl px-4 py-2">
                  <p className="text-green-800 text-sm font-medium">✨ Photo selected and ready to update!</p>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setNewProfilePic('');
                  setAvatarError(false);
                }}
                className="px-8 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                ← Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={!newProfilePic}
                className="px-8 py-3 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-gray-800 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 backdrop-blur-sm border border-gray-300 hover:border-gray-400 hover:scale-105 shadow-lg"
              >
                💫 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Sign out</h3>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}