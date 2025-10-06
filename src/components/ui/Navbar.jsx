"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BellIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "@/store/authStore";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Trips", href: "/trips" },
    { name: "All Trips", href: "/trips/all" },
    { name: "Planner", href: "/planner" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo with Instrument Serif */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" />
          <span className="font-serif text-xl tracking-wide text-gray-900">
            Sanchari Mate
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/planner"
            className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-500 to-green-500 shadow hover:opacity-90 transition font-medium"
          >
            Plan a Trip
          </Link>

          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="text-lg hover:opacity-80 transition p-2 rounded-full hover:bg-gray-100"
            >
              <BellIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button
              aria-label="Messages"
              className="text-lg hover:opacity-80 transition p-2 rounded-full hover:bg-gray-100"
            >
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-700" />
            </button>

            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Plan a Trip Button */}
            <Link
              href="/planner"
              className="block w-full py-3 rounded-md text-white bg-gradient-to-r from-blue-500 to-green-500 shadow hover:opacity-90 transition text-center font-medium"
              onClick={() => setOpen(false)}
            >
              Plan a Trip
            </Link>

            {/* Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <UserProfileDropdown
                  mobileView={true}
                  onItemClick={() => setOpen(false)}
                />
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition text-center font-medium text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-center font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="flex justify-center space-x-6 pt-4">
              <button
                aria-label="Notifications"
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                <BellIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                aria-label="Messages"
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}