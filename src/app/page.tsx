"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import FeaturedCars from "@/components/FeaturedCars";
import Testimonials from "@/components/Testimonial";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Search,
  FileText,
  Handshake,
  Car,
  Shield,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle,
  Zap,
  TrendingUp,
  Smartphone,
  Award,
  DollarSign,
  Users,
  Globe,
  Heart,
  Sparkles,
  ArrowUpRight,
  Bell,
  Star,
  Gauge,
  Calendar,
  Wrench,
  RefreshCw,
  Headphones,
  MousePointer,
  Settings,
  Layers,
  PlusCircle,
  ArrowDown,
  Plus,
  Check,
  ThumbsUp,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  // Refs for scroll animations
  const router = useRouter();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  // State for interactive elements
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Vehicle categories with modern design
  const vehicleCategories = [
    {
      name: "Electric Vehicles",
      icon: <Zap className="h-6 w-6" />,
      count: 423,
      color: "from-emerald-400 to-teal-600",
      image: "/images/categories/electric.jpg",
    },
    {
      name: "Luxury Sedans",
      icon: <Star className="h-6 w-6" />,
      count: 256,
      color: "from-indigo-400 to-blue-600",
      image: "/images/categories/luxury.jpg",
    },
    {
      name: "SUVs & Crossovers",
      icon: <Layers className="h-6 w-6" />,
      count: 512,
      color: "from-amber-400 to-orange-600",
      image: "/images/categories/suv.jpg",
    },
    {
      name: "Sports Cars",
      icon: <Gauge className="h-6 w-6" />,
      count: 189,
      color: "from-red-400 to-rose-600",
      image: "/images/categories/sports.jpg",
    },
    {
      name: "Family Vehicles",
      icon: <Users className="h-6 w-6" />,
      count: 347,
      color: "from-blue-400 to-sky-600",
      image: "/images/categories/family.jpg",
    },
    {
      name: "Budget Friendly",
      icon: <DollarSign className="h-6 w-6" />,
      count: 631,
      color: "from-purple-400 to-violet-600",
      image: "/images/categories/budget.jpg",
    },
  ];

  // Benefits with animated illustrations
  const benefits = [
    {
      title: "Certified Inspections",
      description:
        "Every vehicle undergoes a comprehensive 200+ point inspection by certified technicians",
      icon: <Shield className="h-8 w-8 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      animation: "lottie-inspection.json",
    },
    {
      title: "Transparent Pricing",
      description:
        "No hidden fees or surprises - our prices reflect real market value and vehicle condition",
      icon: <DollarSign className="h-8 w-8 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      animation: "lottie-pricing.json",
    },
    {
      title: "Seamless Experience",
      description:
        "From browsing to delivery, enjoy a smooth and hassle-free car buying journey",
      icon: <MousePointer className="h-8 w-8 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      animation: "lottie-experience.json",
    },
  ];

  // Process steps with interactive elements
  const processSteps = [
    {
      title: "Discover",
      description:
        "Browse our extensive inventory with powerful search filters",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Research",
      description: "Review detailed vehicle history and inspection reports",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Finance",
      description: "Explore personalized financing options and pre-approval",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Purchase",
      description: "Complete your purchase online or with an advisor",
      icon: <Handshake className="h-6 w-6" />,
    },
  ];

  // Guarantee features
  const guarantees = [
    {
      title: "7-Day Returns",
      description: "Not satisfied? Return within 7 days for a full refund",
      icon: <RefreshCw className="h-6 w-6 text-white" />,
    },
    {
      title: "90-Day Warranty",
      description: "Comprehensive coverage for major components",
      icon: <Shield className="h-6 w-6 text-white" />,
    },
    {
      title: "Price Match",
      description: "Found a better price? We'll match it",
      icon: <DollarSign className="h-6 w-6 text-white" />,
    },
    {
      title: "24/7 Support",
      description: "Expert assistance whenever you need it",
      icon: <Headphones className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        <Banner />

        <FeaturedCars />

        {/* How It Works - Enhanced Interactive Section */}
        <section
          className="py-24 bg-white relative overflow-hidden"
          ref={targetRef}
        >
          {/* Animated background elements */}
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-70 blur-3xl"
          ></motion.div>
          <motion.div
            style={{ y: y2, opacity }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-70 blur-3xl"
          ></motion.div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border-4 border-blue-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border-8 border-purple-100 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-40 left-20 w-10 h-10 bg-emerald-300 rounded-full opacity-40"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            {/* Section header */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                  <Zap size={14} className="mr-1.5" />
                  <span>Simplified Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Car Buying <span className="text-blue-600">Reimagined</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  We've streamlined every step of the car buying journey to make
                  it transparent, convenient, and enjoyable.
                </p>
              </motion.div>
            </div>

            {/* Interactive Process Flow */}
            <div className="relative">
              {/* Central progress line with animated gradient */}
              <div className="absolute left-1/2 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 transform -translate-x-1/2 hidden md:block"></div>

              {/* Process steps with enhanced visuals */}
              <div className="space-y-32 relative">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step number indicator (visible on mobile and desktop) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-10">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-purple-500"
                            : index === 2
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      >
                        <span className="text-4xl font-bold text-white">
                          {index + 1}
                        </span>
                      </motion.div>
                    </div>

                    <div
                      className={`flex flex-col ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      } items-center gap-8 md:gap-16 pt-12`}
                    >
                      {/* Content card */}
                      <motion.div
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                      >
                        <div
                          className={`bg-white rounded-3xl p-10 relative overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-500`}
                        >
                          {/* Colored accent in corner */}
                          <div
                            className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${
                              index === 0
                                ? "bg-blue-500/10"
                                : index === 1
                                ? "bg-purple-500/10"
                                : index === 2
                                ? "bg-emerald-500/10"
                                : "bg-amber-500/10"
                            }`}
                          ></div>

                          <div className="relative">
                            {/* Icon with colored background */}
                            <div
                              className={`w-16 h-16 rounded-2xl ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                  ? "bg-purple-500"
                                  : index === 2
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              } flex items-center justify-center mb-8 shadow-lg`}
                            >
                              <div className="text-white">{step.icon}</div>
                            </div>

                            <h3
                              className={`text-3xl font-bold mb-4 ${
                                index === 0
                                  ? "text-blue-800"
                                  : index === 1
                                  ? "text-purple-800"
                                  : index === 2
                                  ? "text-emerald-800"
                                  : "text-amber-800"
                              }`}
                            >
                              {step.title}
                            </h3>

                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                              {step.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-6">
                              {step.features &&
                                step.features.map((feature, i) => (
                                  <div key={i} className="flex items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full ${
                                        index === 0
                                          ? "bg-blue-100 text-blue-600"
                                          : index === 1
                                          ? "bg-purple-100 text-purple-600"
                                          : index === 2
                                          ? "bg-emerald-100 text-emerald-600"
                                          : "bg-amber-100 text-amber-600"
                                      } flex items-center justify-center mr-2`}
                                    >
                                      <Check size={12} />
                                    </div>
                                    <span className="text-gray-700">
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            <button
                              className={`inline-flex items-center text-sm font-medium ${
                                index === 0
                                  ? "text-blue-600 hover:text-blue-700"
                                  : index === 1
                                  ? "text-purple-600 hover:text-purple-700"
                                  : index === 2
                                  ? "text-emerald-600 hover:text-emerald-700"
                                  : "text-amber-600 hover:text-amber-700"
                              } transition-colors`}
                              onClick={() => router.push("/about")}
                            >
                              Learn more
                              <ArrowRight
                                size={14}
                                className="ml-2 transition-transform group-hover:translate-x-1"
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Image with interactive elements */}
                      <div className="md:w-1/2 relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.3 }}
                          className="relative"
                        >
                          {/* Decorative elements around image */}
                          <div
                            className={`absolute -top-4 -left-4 w-12 h-12 rounded-lg ${
                              index === 0
                                ? "bg-blue-200"
                                : index === 1
                                ? "bg-purple-200"
                                : index === 2
                                ? "bg-emerald-200"
                                : "bg-amber-200"
                            } -z-10 opacity-70`}
                          ></div>

                          <div
                            className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-lg ${
                              index === 0
                                ? "bg-blue-200"
                                : index === 1
                                ? "bg-purple-200"
                                : index === 2
                                ? "bg-emerald-200"
                                : "bg-amber-200"
                            } -z-10 opacity-70`}
                          ></div>

                          {/* Main image with enhanced styling */}
                          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={
                                  index === 0
                                    ? "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&q=80"
                                    : index === 1
                                    ? "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&q=80"
                                    : index === 2
                                    ? "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop&q=80"
                                    : "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&q=80"
                                }
                                alt={step.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                              />

                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                              {/* Caption at bottom of image */}
                              <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center">
                                  <div
                                    className={`w-10 h-10 rounded-full ${
                                      index === 0
                                        ? "bg-blue-500"
                                        : index === 1
                                        ? "bg-purple-500"
                                        : index === 2
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
                                    } flex items-center justify-center mr-3`}
                                  >
                                    {index === 0 ? (
                                      <Search
                                        size={18}
                                        className="text-white"
                                      />
                                    ) : index === 1 ? (
                                      <FileText
                                        size={18}
                                        className="text-white"
                                      />
                                    ) : index === 2 ? (
                                      <Key size={18} className="text-white" />
                                    ) : (
                                      <ThumbsUp
                                        size={18}
                                        className="text-white"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold">
                                      {index === 0
                                        ? "Find Your Perfect Match"
                                        : index === 1
                                        ? "Paperwork Made Simple"
                                        : index === 2
                                        ? "Drive Away Happy"
                                        : "Enjoy Peace of Mind"}
                                    </h4>
                                    <p className="text-white/80 text-sm">
                                      {index === 0
                                        ? "Browse our extensive inventory"
                                        : index === 1
                                        ? "Quick digital processing"
                                        : index === 2
                                        ? "Same-day delivery available"
                                        : "With our comprehensive warranty"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Interactive hotspots on image */}
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`absolute w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                                    i === 0
                                      ? "top-1/4 left-1/4"
                                      : i === 1
                                      ? "top-1/3 right-1/4"
                                      : "bottom-1/3 left-1/3"
                                  }`}
                                >
                                  <Plus
                                    size={14}
                                    className={
                                      index === 0
                                        ? "text-blue-600"
                                        : index === 1
                                        ? "text-purple-600"
                                        : index === 2
                                        ? "text-emerald-600"
                                        : "text-amber-600"
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final call to action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="mt-32 text-center"
              >
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1 pr-4 mb-8">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <Sparkles size={14} />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Ready to experience it yourself?
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Start Your Journey Today
                </h3>

                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-10 rounded-xl"
                >
                  Browse our inventory
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Guarantees Section - New */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_50%)]"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Shield size={14} className="mr-1.5" />
                <span>Peace of Mind</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-blue-600">Guarantees</span> to You
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We stand behind every vehicle we sell with industry-leading
                protections designed for your complete peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {guarantees.map((guarantee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform group-hover:scale-[1.03] transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg transform group-hover:translate-y-[-4px] group-hover:translate-x-[-4px] transition-transform duration-300">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
                      {guarantee.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {guarantee.title}
                    </h3>
                    <p className="text-gray-600">{guarantee.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 rounded-xl">
                Learn more about our guarantees
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Component */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
