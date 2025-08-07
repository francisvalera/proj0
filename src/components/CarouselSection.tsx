"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Define the type for a single carousel image
interface CarouselImage {
  id: string;
  title: string;
  imageUrl: string;
}

// Define the props for the CarouselSection component
interface CarouselSectionProps {
  images: CarouselImage[];
}

// The Carousel component, now a Client Component to handle state.
export default function CarouselSection({ images }: CarouselSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const goToPrevious = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-80 md:h-[500px] bg-gray-900 flex items-center justify-center">
        <p className="text-white">No images for carousel.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 md:h-[500px] overflow-hidden bg-black">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70 z-10" />
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h2 className="text-3xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                {image.title.toUpperCase()}
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto mb-6" />
              <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-500 hover:bg-red-600">
                EXPLORE NOW
              </Link>
            </div>
          </div>
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center"><ChevronLeft className="h-7 w-7 text-white" /></button>
          <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center"><ChevronRight className="h-7 w-7 text-white" /></button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
            {images.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
