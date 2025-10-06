"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const destinations = [
  {
    name: "Paris",
    image:
      "https://th.bing.com/th/id/R.b03754303e04fdfc6b5752f925217db1?rik=%2fpfOKep1laGd3A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fFAX9Jf5.jpg&ehk=%2bcmNHS0kMwNO1i0cDnFncHBY%2fIqxsrDyFd%2fatMrNLVY%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Kerala ,India",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Bali",
    image:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=60",
  },
    {
    name: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1679602270994-0d10c609ac4c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Banff National Park, Canada",
    image: "https://images.unsplash.com/photo-1511525499366-bc3f823bacb7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmFuZmYlMjBOYXRpb25hbCUyMFBhcmslMkMlMjBDYW5hZGF8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Serengeti National Park, Tanzania",
    image: "https://plus.unsplash.com/premium_photo-1666690195740-7b1e483d2de8?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Iceland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Phi Phi Islands, Thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Venice, Italy",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&auto=format&fit=crop&q=60",
  },
]

export default function DestinationsCarousel() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    // Animation for section entrance
    if (sectionRef.current) {
      gsap.from(sectionRef.current, {
        opacity: 1,
        y: 50,
        duration: 2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      })
    }

    // Responsive items per view
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= destinations.length - itemsPerView ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? destinations.length - itemsPerView : prevIndex - 1
    )
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 px-6 bg-gradient-to-br from-slate-50 to-cyan-100"
    >
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
       <span>Popular </span>  <span className="text-blue-600">Destinations</span>
      </h2>

      <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
        {/* Carousel container */}
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-105 transform transition duration-300">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {dest.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-blue-100 transition-colors z-10"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-blue-100 transition-colors z-10"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}