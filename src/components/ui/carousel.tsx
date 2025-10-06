"use client"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { DESTINATIONS } from '@/lib/constants'

export default function DestinationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
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
      prevIndex >= DESTINATIONS.length - itemsPerView ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? DESTINATIONS.length - itemsPerView : prevIndex - 1
    )
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-black-900">
       <span>Popular </span>  <span className="text-blue-500"> Destinations</span>
      </h2>

      <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
        {/* Carousel container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {DESTINATIONS.map((dest, index) => (
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