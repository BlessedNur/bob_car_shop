"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Quote,
  ThumbsUp,
  Clock,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Modified testimonials array to include at least 20 reviews from US, Canada, and UK
const testimonials = [
  {
    name: "Michael Thompson",
    location: "New York, USA",
    title: "Patriot Auto Sales exceeded my expectations!",
    content:
      "I had been searching for a reliable SUV for months when I discovered Patriot Auto Sales online. Their detailed inspection report gave me complete confidence in my purchase. The entire process was transparent and efficient - from selecting the vehicle to finalizing the paperwork. Their team handled everything professionally and I got an excellent deal on a Toyota RAV4 that was in perfect condition.",
    date: "15 Mar, 2025",
    avatar: "/avatars/michael.jpg",
    rating: 5,
    vehicle: "Toyota RAV4",
  },
  {
    name: "Sarah Miller",
    location: "London, UK",
    title: "Impressed with their service!",
    content:
      "I recently purchased a 2021 BMW 3 Series through Patriot Auto Sales. The inspection report was incredibly comprehensive and when I visited to see the car, everything matched exactly what was documented. Their staff were knowledgeable and helped negotiate a fair price. The international shipping process was handled seamlessly. I would absolutely recommend Patriot Auto Sales to anyone looking for quality vehicles worldwide.",
    date: "28 Feb, 2025",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    vehicle: "BMW 3 Series",
  },
  {
    name: "David Chen",
    location: "Toronto, Canada",
    title: "Excellent customer experience!",
    content:
      "What impressed me most about Patriot Auto Sales was their detailed inspection report. It was far more comprehensive than anything a local mechanic could provide. They connected me with the seller, facilitated our meeting at their center, and helped with negotiations. I got my Mercedes C-Class at a competitive price, and after six months of driving, I haven't encountered a single issue. Their after-sales support has been outstanding as well.",
    date: "12 Jan, 2025",
    avatar: "/avatars/david.jpg",
    rating: 4,
    vehicle: "Mercedes C-Class",
  },
  {
    name: "Robert Johnson",
    location: "Chicago, USA",
    title: "Top-notch vehicle selection and service",
    content:
      "After my local dealerships disappointed me with their limited inventory, I found exactly what I was looking for at Patriot Auto Sales. Their online platform made browsing easy, and their team was incredibly responsive to my questions. The Jeep Wrangler I purchased was in immaculate condition and priced fairly. The paperwork was handled efficiently, and they even helped arrange delivery to my home in Chicago.",
    date: "5 Feb, 2025",
    avatar: "/avatars/robert.jpg",
    rating: 5,
    vehicle: "Jeep Wrangler",
  },
  {
    name: "Emily Wilson",
    location: "Manchester, UK",
    title: "Seamless purchase from start to finish",
    content:
      "As someone who dreads car shopping, Patriot Auto Sales made the experience surprisingly pleasant. Their no-pressure approach and transparent pricing were refreshing. They found me a certified pre-owned Volvo XC60 that met all my requirements and arranged for delivery to Manchester without any hassle. Their attention to detail in the inspection report gave me complete peace of mind with my purchase.",
    date: "20 Jan, 2025",
    avatar: "/avatars/emily.jpg",
    rating: 5,
    vehicle: "Volvo XC60",
  },
  {
    name: "Jennifer Adams",
    location: "Boston, USA",
    title: "Exceptional value and customer service",
    content:
      "Patriot Auto Sales helped me find a certified pre-owned Audi A4 that was significantly below market value. Their inspection process is incredibly thorough, identifying even minor issues that were addressed before delivery. The sales team was knowledgeable without being pushy, and they handled all the paperwork efficiently. I've already recommended them to several friends looking for quality vehicles.",
    date: "7 Dec, 2024",
    avatar: "/avatars/jennifer.jpg",
    rating: 5,
    vehicle: "Audi A4",
  },
  {
    name: "William Taylor",
    location: "Edinburgh, UK",
    title: "Trustworthy and professional service",
    content:
      "I was initially hesitant about purchasing a vehicle from a dealer I hadn't visited in person, but Patriot Auto Sales quickly earned my trust. Their video walkaround of the Range Rover I was interested in was comprehensive, and they were completely transparent about its history and condition. The import process to Scotland was handled seamlessly, and the vehicle arrived exactly as described. I couldn't be happier with my experience.",
    date: "15 Nov, 2024",
    avatar: "/avatars/william.jpg",
    rating: 5,
    vehicle: "Range Rover",
  },
  {
    name: "Jessica Martinez",
    location: "Vancouver, Canada",
    title: "Found my perfect car at a great price",
    content:
      "Patriot Auto Sales helped me find a Honda CR-V with all the features I wanted at a price well below what local dealerships were offering. Their team was patient as I compared different options, and they provided detailed information about each vehicle's history and condition. The purchase process was straightforward, and they handled all the paperwork efficiently. The vehicle has performed flawlessly since I received it.",
    date: "3 Oct, 2024",
    avatar: "/avatars/jessica.jpg",
    rating: 5,
    vehicle: "Honda CR-V",
  },
  {
    name: "Andrew Wilson",
    location: "Seattle, USA",
    title: "Remarkable attention to detail",
    content:
      "As someone who knows cars well, I was impressed by Patriot Auto Sales' technical knowledge and thorough inspection process. They provided comprehensive reports on the BMW M3 I was interested in, including compression tests and detailed diagnostics. They were honest about a minor issue with the suspension and had it fixed before delivery. Their transparency and expertise made the entire process smooth and reassuring.",
    date: "18 Sep, 2024",
    avatar: "/avatars/andrew.jpg",
    rating: 5,
    vehicle: "BMW M3",
  },
  {
    name: "Elizabeth Brown",
    location: "Bristol, UK",
    title: "Excellent service from start to finish",
    content:
      "Patriot Auto Sales made importing a vehicle to the UK incredibly straightforward. They handled all the complex paperwork and ensured the Mazda CX-5 I purchased met all UK regulations. Their communication was excellent throughout the process, and they were always available to answer my questions despite the time difference. The car arrived in perfect condition and exactly as described in their detailed report.",
    date: "25 Aug, 2024",
    avatar: "/avatars/elizabeth.jpg",
    rating: 5,
    vehicle: "Mazda CX-5",
  },
  {
    name: "Ryan Campbell",
    location: "Ottawa, Canada",
    title: "Simplified the import process",
    content:
      "Importing a vehicle to Canada can be complicated, but Patriot Auto Sales made it straightforward. They were knowledgeable about Canadian regulations and handled all the necessary documentation. The Ford Explorer I purchased was thoroughly inspected and arrived in excellent condition. Their after-sales support has been exceptional, even helping me find a local service center for routine maintenance.",
    date: "10 Jul, 2024",
    avatar: "/avatars/ryan.jpg",
    rating: 5,
    vehicle: "Ford Explorer",
  },
  {
    name: "Olivia Parker",
    location: "Austin, USA",
    title: "Outstanding vehicle selection",
    content:
      "Patriot Auto Sales offered me access to vehicles I simply couldn't find locally. Their online platform was easy to navigate and allowed me to compare multiple options. When I had questions about specific features, their team provided detailed answers and even sent additional photos and videos. The Subaru Outback I purchased arrived in perfect condition and exactly as described. The entire experience was professional from start to finish.",
    date: "5 Jun, 2024",
    avatar: "/avatars/olivia.jpg",
    rating: 4,
    vehicle: "Subaru Outback",
  },
  {
    name: "Thomas Wright",
    location: "Birmingham, UK",
    title: "Hassle-free international purchase",
    content:
      "Patriot Auto Sales took all the stress out of buying a car from overseas. Their detailed inspection reports and transparent pricing gave me confidence in my purchase decision. They guided me through the entire import process, handling all the documentation and ensuring my Lexus RX met UK standards. Their customer service was exceptional, with prompt responses to all my queries despite the time difference.",
    date: "12 May, 2024",
    avatar: "/avatars/thomas.jpg",
    rating: 5,
    vehicle: "Lexus RX",
  },
  {
    name: "Amanda Rodriguez",
    location: "Miami, USA",
    title: "Fantastic selection and service",
    content:
      "After searching local dealerships for months, I found my dream car through Patriot Auto Sales. Their inventory was impressive and their online platform made it easy to find exactly what I wanted. The Audi Q7 I purchased was meticulously inspected and in better condition than advertised. Their team was professional throughout the process and handled all the paperwork efficiently. I couldn't be happier with my experience.",
    date: "28 Apr, 2024",
    avatar: "/avatars/amanda.jpg",
    rating: 5,
    vehicle: "Audi Q7",
  },
  {
    name: "James Harrison",
    location: "Montreal, Canada",
    title: "Exceeded all expectations",
    content:
      "Patriot Auto Sales provided an exceptional car buying experience from start to finish. Their inspection process is incredibly thorough, and they were completely transparent about the vehicle's history and condition. They handled all the import paperwork for my Volkswagen GTI and even arranged for winter tires to be installed before delivery. Their attention to detail and customer service is unmatched in the industry.",
    date: "15 Apr, 2024",
    avatar: "/avatars/james.jpg",
    rating: 5,
    vehicle: "Volkswagen GTI",
  },
  {
    name: "Katherine Lewis",
    location: "Glasgow, UK",
    title: "Professional and reliable service",
    content:
      "I was nervous about purchasing a vehicle from abroad, but Patriot Auto Sales made the process incredibly smooth. Their detailed inspection report of the Mercedes GLC I was interested in covered everything, giving me complete confidence in my purchase. They handled all the shipping and import documentation flawlessly, and the car arrived in perfect condition. I've already recommended them to several friends.",
    date: "2 Apr, 2024",
    avatar: "/avatars/katherine.jpg",
    rating: 5,
    vehicle: "Mercedes GLC",
  },
  {
    name: "Daniel Morgan",
    location: "Philadelphia, USA",
    title: "Transparent and trustworthy",
    content:
      "What sets Patriot Auto Sales apart is their transparency and honesty. When the initial inspection of my chosen vehicle revealed some minor issues, they immediately informed me and offered solutions. They repaired everything before shipping and provided detailed documentation of the work done. The Toyota 4Runner arrived in excellent condition, and their follow-up service has been equally impressive.",
    date: "20 Mar, 2024",
    avatar: "/avatars/daniel.jpg",
    rating: 5,
    vehicle: "Toyota 4Runner",
  },
  {
    name: "Sophia Clark",
    location: "Calgary, Canada",
    title: "Excellent value and service",
    content:
      "Patriot Auto Sales helped me find a vehicle that would have cost thousands more at local dealerships. Their inspection process gave me confidence in the purchase, and they handled all the complex import paperwork. The Subaru Forester I bought has been perfect for Canadian winters, and they even helped me find a local mechanic for regular maintenance. I couldn't be more satisfied with my experience.",
    date: "5 Mar, 2024",
    avatar: "/avatars/sophia.jpg",
    rating: 5,
    vehicle: "Subaru Forester",
  },
  {
    name: "Christopher Allen",
    location: "Cardiff, UK",
    title: "Smooth international purchase",
    content:
      "Patriot Auto Sales made buying a car from overseas remarkably easy. Their knowledge of UK import regulations was impressive, and they handled all the paperwork flawlessly. The BMW X3 I purchased was exactly as described in their comprehensive inspection report. Their communication throughout the process was excellent, and they were always available to answer my questions. I would definitely use their services again.",
    date: "18 Feb, 2024",
    avatar: "/avatars/christopher.jpg",
    rating: 5,
    vehicle: "BMW X3",
  },
  {
    name: "Rachel Thompson",
    location: "Denver, USA",
    title: "Exceptional customer service",
    content:
      "The team at Patriot Auto Sales went above and beyond to help me find the perfect vehicle. They listened to my requirements and suggested several options that matched my needs. The inspection report for the Jeep Grand Cherokee I selected was incredibly detailed, noting even minor issues that were addressed before shipping. The vehicle arrived on time and in perfect condition. Their service was truly exceptional.",
    date: "5 Feb, 2024",
    avatar: "/avatars/rachel.jpg",
    rating: 5,
    vehicle: "Jeep Grand Cherokee",
  },
  {
    name: "Matthew Wilson",
    location: "Toronto, Canada",
    title: "Professional from start to finish",
    content:
      "Patriot Auto Sales provided a level of professionalism I haven't experienced with other dealerships. Their inspection process is thorough and transparent, giving me complete confidence in my purchase. They handled all the import documentation for my Audi Q5 and kept me updated throughout the shipping process. The vehicle arrived exactly as described, and their after-sales support has been excellent.",
    date: "22 Jan, 2024",
    avatar: "/avatars/matthew.jpg",
    rating: 5,
    vehicle: "Audi Q5",
  },
  {
    name: "Victoria Edwards",
    location: "Liverpool, UK",
    title: "Outstanding vehicle quality and service",
    content:
      "I was hesitant about buying a car without seeing it in person, but Patriot Auto Sales provided such detailed information and videos that I felt completely confident. The Range Rover Sport I purchased was in immaculate condition, exactly as described. They handled all the import requirements efficiently, and their communication throughout was excellent. I would definitely recommend their services to anyone looking for quality vehicles.",
    date: "10 Jan, 2024",
    avatar: "/avatars/victoria.jpg",
    rating: 5,
    vehicle: "Range Rover Sport",
  },
  {
    name: "Benjamin Carter",
    location: "San Francisco, USA",
    title: "Impressive attention to detail",
    content:
      "As someone who's particular about cars, I appreciated Patriot Auto Sales' meticulous inspection process. They documented every aspect of the Porsche Macan I was interested in, from mechanical condition to cosmetic details. They were upfront about a small scratch on the door and had it repaired before delivery. The car arrived in perfect condition, and the entire experience was smooth and professional.",
    date: "28 Dec, 2023",
    avatar: "/avatars/benjamin.jpg",
    rating: 5,
    vehicle: "Porsche Macan",
  },
  {
    name: "Natalie Scott",
    location: "Edmonton, Canada",
    title: "Simplified the import process",
    content:
      "Patriot Auto Sales made importing a vehicle to Canada incredibly straightforward. Their knowledge of Canadian regulations saved me from potential headaches, and they handled all the necessary paperwork. The Honda Pilot I purchased was thoroughly inspected and arrived in excellent condition. Their customer service was outstanding throughout the process, and I've already recommended them to several colleagues.",
    date: "15 Dec, 2023",
    avatar: "/avatars/natalie.jpg",
    rating: 5,
    vehicle: "Honda Pilot",
  },
];

// Group testimonials by country for the statistics section
const testimonialStats = {
  usa: testimonials.filter((t) => t.location.includes("USA")).length,
  uk: testimonials.filter((t) => t.location.includes("UK")).length,
  canada: testimonials.filter((t) => t.location.includes("Canada")).length,
  fiveStarRating:
    (testimonials.filter((t) => t.rating === 5).length / testimonials.length) *
    100,
};

export default function Testimonials() {
  // Testimonial carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [visibleTestimonials, setVisibleTestimonials] = useState(testimonials);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  // Filter testimonials based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setVisibleTestimonials(testimonials);
    } else if (activeTab === "usa") {
      setVisibleTestimonials(
        testimonials.filter((t) => t.location.includes("USA"))
      );
    } else if (activeTab === "uk") {
      setVisibleTestimonials(
        testimonials.filter((t) => t.location.includes("UK"))
      );
    } else if (activeTab === "canada") {
      setVisibleTestimonials(
        testimonials.filter((t) => t.location.includes("Canada"))
      );
    }
    setActiveSlide(0);
  }, [activeTab]);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoplayEnabled) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % visibleTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [visibleTestimonials.length, autoplayEnabled]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % visibleTestimonials.length);
    setAutoplayEnabled(false);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) =>
        (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length
    );
    setAutoplayEnabled(false);
  };

  // Mouse drag functionality for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
    setAutoplayEnabled(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const newSlide = Math.round(carouselRef.current.scrollLeft / slideWidth);
      setActiveSlide(newSlide);
      carouselRef.current.scrollTo({
        left: newSlide * slideWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-50 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
        <svg
          className="absolute top-0 right-0 text-blue-50 w-32 h-32 md:w-64 md:h-64"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M42.7,-73.4C55.9,-67.1,67.7,-56.9,76.3,-43.9C84.9,-30.9,90.3,-15.4,89.8,-0.3C89.3,14.9,82.9,29.8,73.5,42.4C64.1,55,51.7,65.3,38.1,71.2C24.5,77.2,9.8,78.8,-5.4,77.6C-20.6,76.4,-36.3,72.4,-47.9,63.5C-59.5,54.6,-67,40.8,-73.3,26.2C-79.6,11.7,-84.7,-3.7,-81.3,-17.2C-77.9,-30.8,-66,-42.5,-53.2,-48.9C-40.3,-55.3,-26.5,-56.3,-13.7,-62.5C-0.9,-68.8,10.9,-80.2,24.4,-81.5C38,-82.8,53.3,-74,67.4,-62.3C81.5,-50.7,94.5,-36.2,94.8,-21.9C95.1,-7.7,82.8,6.3,74.3,19.5C65.9,32.7,61.3,45.1,52.5,55.1C43.7,65.1,30.6,72.7,17.3,71.9C4,71.1,-9.5,61.9,-23.6,56.2C-37.7,50.5,-52.5,48.3,-63.9,40.5C-75.3,32.7,-83.4,19.3,-85.1,5.1C-86.8,-9.2,-82.2,-24.2,-73.7,-36.3C-65.2,-48.4,-52.9,-57.5,-39.8,-64C-26.7,-70.5,-12.9,-74.3,1.2,-76.3C15.3,-78.3,30.6,-78.5,42.7,-73.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header with animated elements */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <ThumbsUp size={14} className="mr-2" />
              <span>Customer Experiences</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="text-blue-600">Clients Say</span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Discover why thousands of customers trust Patriot Auto Sales for
              their vehicle purchases
            </p>

            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setActiveTab("usa")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "usa"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              United States
            </button>
            <button
              onClick={() => setActiveTab("uk")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "uk"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              United Kingdom
            </button>
            <button
              onClick={() => setActiveTab("canada")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "canada"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Canada
            </button>
          </div>
        </div>

        {/* Enhanced Testimonial Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Featured testimonial - larger */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full">
                      <div className="p-8 md:p-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">
                                {visibleTestimonials[activeSlide].name}
                              </h4>
                              <div className="text-gray-500 flex items-center text-sm">
                                <MapPin size={14} className="mr-1" />
                                {visibleTestimonials[activeSlide].location}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  className={
                                    i < visibleTestimonials[activeSlide].rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 mb-6 relative">
                          <Quote
                            size={40}
                            className="absolute top-4 left-4 text-blue-200 opacity-40"
                          />
                          <h3 className="text-xl font-bold mb-4 text-gray-900 pl-8">
                            {visibleTestimonials[activeSlide].title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {visibleTestimonials[activeSlide].content}
                          </p>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between">
                          <div className="flex items-center text-gray-500 text-sm mb-2 sm:mb-0">
                            <Clock size={16} className="mr-1.5" />
                            {visibleTestimonials[activeSlide].date}
                          </div>
                          <div className="flex items-center">
                            <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {visibleTestimonials[activeSlide].vehicle}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next testimonials preview */}
                  <div className="hidden lg:flex flex-col space-y-6">
                    {[1, 2].map((offset) => {
                      const index =
                        (activeSlide + offset) % visibleTestimonials.length;
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => {
                            setActiveSlide(index);
                            setAutoplayEnabled(false);
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {visibleTestimonials[index].name}
                                  </h4>
                                  <div className="text-gray-500 flex items-center text-xs">
                                    <MapPin size={10} className="mr-1" />
                                    {visibleTestimonials[index].location}
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={
                                      i < visibleTestimonials[index].rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            <h3 className="text-sm font-bold mb-2 text-gray-900 line-clamp-1">
                              {visibleTestimonials[index].title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {visibleTestimonials[index].content}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Up next indicator */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                      <div className="flex items-center mb-4">
                        <Shield size={20} className="mr-2" />
                        <h3 className="font-bold">Patriot Promise</h3>
                      </div>
                      <p className="text-blue-100 text-sm mb-4">
                        Every review is from a verified customer who purchased a
                        vehicle through Patriot Auto Sales.
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {visibleTestimonials.length} verified reviews
                        </span>
                        <div className="flex space-x-1">
                          {[
                            ...Array(Math.min(5, visibleTestimonials.length)),
                          ].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                (activeSlide + i) %
                                  visibleTestimonials.length ===
                                activeSlide
                                  ? "bg-white"
                                  : "bg-white/40"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 md:-translate-x-0 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-blue-600 focus:outline-none z-10 transition-transform hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 md:translate-x-0 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-blue-600 focus:outline-none z-10 transition-transform hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8">
            {visibleTestimonials.slice(0, 10).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveSlide(index);
                  setAutoplayEnabled(false);
                }}
                className={`w-2.5 h-2.5 mx-1 rounded-full transition-all ${
                  activeSlide === index
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
            {visibleTestimonials.length > 10 && (
              <span className="text-gray-400 text-xs ml-2 self-center">
                +{visibleTestimonials.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Call to action */}
      </div>
    </section>
  );
}
