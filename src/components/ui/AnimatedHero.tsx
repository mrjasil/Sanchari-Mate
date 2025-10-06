"use client";
import Link from "next/link";
import { useGsapAnimation } from '@/hooks/useGsapAnimation';

export default function AnimatedHero() {
  const { heroRef } = useGsapAnimation();

  // Split title into words for animation
  const titleWords = "Your beautiful travel companion".split(" ");

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="parallax-bg absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="parallax-bg absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="parallax-bg absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        
        {/* Main Content - Centered */}
        <div className="space-y-8">
          {/* Main Title with Split Text Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal leading-tight">
            {titleWords.map((word, index) => (
              <span
                key={index}
                className="hero-title-word inline-block mr-4 last:mr-0"
              >
                {word === "companion" ? (
                  <span className="gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent bg-size-200">
                    {word}
                  </span>
                ) : (
                  <span className="text-gray-900">{word}</span>
                )}
              </span>
            ))}
          </h1>

          {/* Animated Subtitle */}
          <div className="overflow-hidden">
            <p className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
              Plan smarter, explore further, and capture every memory. Your journey begins here with Sanchari Mate.
            </p>
          </div>

          {/* Animated Buttons with Magnetic Effect */}
          <div className="flex flex-col sm:flex-row gap-6 pt-12 justify-center">
            <Link
              href="/planner"
              className="magnetic-button hero-button group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden font-semibold text-lg md:text-xl"
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <span className="text-2xl">✨</span>
                Start Planning
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>

            <Link
              href="/trips"
              className="magnetic-button hero-button group relative px-12 py-6 bg-white text-gray-800 border-2 border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden font-semibold text-lg md:text-xl hover:border-blue-400"
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <span className="text-2xl">🌍</span>
                Explore Trips
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>

          {/* Animated Feature Tags - Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-2xl mx-auto">
            {[
              { icon: "🚀", text: "AI Planning", color: "from-blue-500 to-blue-600" },
              { icon: "💸", text: "Smart Budget", color: "from-green-500 to-green-600" },
              { icon: "📸", text: "Memories", color: "from-purple-500 to-purple-600" },
              { icon: "👥", text: "Group Travel", color: "from-orange-500 to-orange-600" }
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-item group relative bg-white/80 backdrop-blur-sm px-4 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="font-medium text-gray-700 text-sm md:text-base text-center">
                    {feature.text}
                  </span>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </section>
  );
}