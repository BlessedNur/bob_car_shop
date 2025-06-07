"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Banner images and text content
const bannerContent = [
  {
    image:
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",
    title: "Luxury Meets Performance",
    subtitle:
      "Experience the thrill of premium vehicles with exceptional handling",
    cta: "View Inventory",
  },
  {
    image:
      "https://images.pexels.com/photos/1429775/pexels-photo-1429775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",
    title: "Find Your Dream SUV",
    subtitle: "Spacious, powerful, and ready for any adventure",
    cta: "View Inventory",
  },
  {
    image:
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",
    title: "Affordable Excellence",
    subtitle: "Quality pre-owned vehicles that won't break the bank",
    cta: "View Inventory",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerContent.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Pause autoplay when user interacts with slider
  const handleManualNavigation = (index) => {
    setCurrentSlide(index);
    setIsAutoplay(false);

    // Resume autoplay after 10 seconds of inactivity
    const timeout = setTimeout(() => {
      setIsAutoplay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  };

  const nextSlide = () => {
    handleManualNavigation((currentSlide + 1) % bannerContent.length);
  };

  const prevSlide = () => {
    handleManualNavigation(
      (currentSlide - 1 + bannerContent.length) % bannerContent.length
    );
  };

  return (
    <section className="relative text-white overflow-hidden font-montserrat h-[500px] md:h-[600px] lg:h-[700px]">
      {/* Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={bannerContent[currentSlide].image}
            alt="Featured vehicle"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay for better text visibility - matching navbar colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/20"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10 h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-block bg-blue-400 text-blue-900 text-sm font-bold px-4 py-1 rounded-full mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Premium Selection
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {bannerContent[currentSlide].title.split(" ").map((word, i) => (
                <span key={i} className={i % 2 === 1 ? "text-blue-300" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-md">
              {bannerContent[currentSlide].subtitle}
            </p>

            {/* Single Call to Action Button */}
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-lg text-base shadow-lg hover:shadow-xl transition-all flex items-center group">
                {bannerContent[currentSlide].cta}
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3 z-20">
          {bannerContent.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualNavigation(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-blue-400 w-10"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800 rounded-full p-2 transition-all z-20"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800 rounded-full p-2 transition-all z-20"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-blue-300/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-3 bg-blue-300 rounded-full mt-2"
          />
        </motion.div>
      </div>
    </section>
  );
}
