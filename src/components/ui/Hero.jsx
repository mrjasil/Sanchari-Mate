"use client";
import Link from "next/link";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Simple fade-in animation
      gsap.fromTo(".hero-content > *",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center hero-content"
    >
      {/* Left Side - Text */}
      <div>
        <h1 className="text-4xl md:text-5xl font-serif font-normal leading-tight text-gray-900">
          Your beautiful travel <span className="text-blue-500">companion</span> 
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Plan smarter, explore further, and capture every memory. Sanchari Mate
          blends ocean blues, adventure greens, and sunset vibes into a
          delightful experience.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link
            href="/planner"
            className="px-6 py-3 rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 shadow hover:opacity-90 transition"
          >
            Start Planning
          </Link>
          <Link
            href="/trips"
            className="px-6 py-3 rounded-md border shadow hover:bg-gray-50 transition"
          >
            View My Trips
          </Link>
        </div>

        {/* Feature List */}
        <div className="mt-8 flex items-center space-x-6 text-sm">
          <span className="flex items-center space-x-1 text-blue-600">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> 
            <span>Smart trip planning</span>
          </span>
          <span className="flex items-center space-x-1 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-600" /> 
            <span>Expense sharing</span>
          </span>
          <span className="flex items-center space-x-1 text-orange-600">
            <span className="w-2 h-2 rounded-full bg-orange-600" /> 
            <span>Memory gallery</span>
          </span>
        </div>
      </div>

      {/* Right Side - Visual Element */}
      <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center">
        <span className="text-white text-6xl">🌍</span>
      </div>
    </section>
  );
}