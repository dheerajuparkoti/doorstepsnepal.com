"use client";

import React from "react"

import Image from "next/image";
import { useEffect, useState } from "react";

const authImages = [
  "/carousel/home-services-1.jpg",
  "/carousel/home-services-2.jpg",
  "/carousel/home-services-3.jpg",
  "/carousel/home-services-4.jpg",
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % authImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image carousel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        {authImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt="Doorsteps Nepal Services"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
          </div>
        ))}
        
        {/* Branding overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white z-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Doorsteps Nepal</h1>
            <p className="text-lg text-white/80">Trusted Home Services</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="text-lg">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="text-lg">Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="text-lg">Easy Booking</span>
              </div>
            </div>
            
            {/* Dots indicator */}
            <div className="flex gap-2">
              {authImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImage ? "w-8 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-1">Doorsteps Nepal</h1>
            <p className="text-muted-foreground text-sm">Trusted Home Services</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
