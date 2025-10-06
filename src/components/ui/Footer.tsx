"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Section - Centered with Instrument Serif */}
        <div className="md:col-span-4 text-center mb-8">
          <h3 className="font-serif text-3xl text-gray-900 mb-4">Sanchari Mate</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-base">
            Plan smarter, explore further, and capture every memory. Your beautiful travel companion for unforgettable adventures.
          </p>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mt-6">
            {/* Facebook */}
            <Link 
              href="https://facebook.com/yourpage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>

            {/* Instagram */}
            <Link 
              href="https://instagram.com/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.273 14.865 3.783 13.714 3.783 12.417s.49-2.448 1.343-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.875 1.343 2.026 1.343 3.323s-.49 2.448-1.343 3.323c-.854.807-2.005 1.297-3.323 1.297zm8.062-10.956h-2.107c.087.49.14.98.14 1.522 0 2.94-2.39 5.33-5.33 5.33s-5.33-2.39-5.33-5.33c0-.542.053-1.032.14-1.522H3.783v8.855c0 .542.49 1.032 1.032 1.032h10.664c.542 0 1.032-.49 1.032-1.032V6.032zm-5.278 2.39c0-.542.49-1.032 1.032-1.032s1.032.49 1.032 1.032-.49 1.032-1.032 1.032-1.032-.49-1.032-1.032z"/>
              </svg>
            </Link>

            {/* Twitter */}
            <Link 
              href="https://twitter.com/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
              </svg>
            </Link>

            {/* WhatsApp */}
            <Link 
              href="https://wa.me/yourphonenumber" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.495 3.59"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Product */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Product</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link href="/planner" className="hover:text-blue-500 transition-colors text-base">
                Trip Planner
              </Link>
            </li>
            <li>
              <Link href="/trips" className="hover:text-blue-500 transition-colors text-base">
                My Trips
              </Link>
            </li>
            <li>
              <Link href="/trips/all" className="hover:text-blue-500 transition-colors text-base">
                Discover Trips
              </Link>
            </li>
            <li>
              <Link href="/memories" className="hover:text-blue-500 transition-colors text-base">
                Memories
              </Link>
            </li>
          </ul>
        </div>

        {/* Explore */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Explore</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link href="/trips/all" className="hover:text-blue-500 transition-colors text-base">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/planner" className="hover:text-blue-500 transition-colors text-base">
                Create Trip
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500 transition-colors text-base">
                Travel Guides
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500 transition-colors text-base">
                Community
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Support</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link href="/help" className="hover:text-blue-500 transition-colors text-base">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-500 transition-colors text-base">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/safety" className="hover:text-blue-500 transition-colors text-base">
                Travel Safety
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-500 transition-colors text-base">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Company</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link href="/about" className="hover:text-blue-500 transition-colors text-base">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-blue-500 transition-colors text-base">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-500 transition-colors text-base">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-500 transition-colors text-base">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Sanchari Mate. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-gray-700 transition-colors">
                Sitemap
              </Link>
              <Link href="/cookies" className="hover:text-gray-700 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}