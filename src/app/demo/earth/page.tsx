"use client";
import ThreeJSEarth from '@/components/ui/ThreeJsEarth';

export default function EarthDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
            Interactive Earth
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our beautiful planet with real-time animations. 
            Watch the airplane travel between iconic destinations.
          </p>
        </div>
        
        <div className="h-[600px] lg:h-[800px] rounded-3xl overflow-hidden shadow-2xl">
          <ThreeJSEarth />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-serif text-xl mb-2">Real-time Rotation</h3>
            <p className="text-gray-300">Watch the Earth rotate with realistic cloud movements</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="font-serif text-xl mb-2">Airplane Animation</h3>
            <p className="text-gray-300">Follow the airplane as it orbits around the globe</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-serif text-xl mb-2">Destination Markers</h3>
            <p className="text-gray-300">Discover popular travel destinations worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}