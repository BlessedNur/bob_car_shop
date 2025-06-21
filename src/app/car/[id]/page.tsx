"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Shield,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Share2,
  Heart,
  Calendar,
  Fuel,
  Gauge,
  Loader2,
  Car,
  Star,
  DollarSign,
  CreditCard,
  FileText,
  CarFront,
  Settings,
  Sparkles,
  ArrowRight,
  Maximize,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define car type
type Car = {
  id: string;
  title: string;
  price: number;
  location: string;
  condition: string;
  mileage: number;
  year: number;
  images: string[];
  transmission: string;
  make: string;
  model: string;
  color: string;
  currency: string;
  fuelType: string;
  downPayment?: number;
  description: string;
  createdAt: string;
  engineSize?: string;
  registeredState?: string;
  sellingCondition?: string;
  boughtCondition?: string;
  features?: string[];
  sellerInfo?: {
    name: string;
    verified: boolean;
    memberSince: string;
    responseRate: string;
    responseTime: string;
    phone: string;
    location: string;
  };
};

// Dynamically get currency symbol for different regions
const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "$":
      return "USD";
    case "€":
      return "EUR";
    case "£":
      return "GBP";
    case "¥":
      return "JPY";
    case "₩":
      return "KRW";
    case "₹":
      return "INR";
    case "A$":
      return "AUD";
    case "C$":
      return "CAD";
    default:
      return "USD";
  }
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // State for car data
  const [carDetails, setCarDetails] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // State for image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // State for contact information
  const [showContact, setShowContact] = useState(false);

  // State for favorites
  const [isFavorite, setIsFavorite] = useState(false);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    description: true,
    sellerInfo: true,
    specifications: false,
  });

  // Ref for carousel scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  // State for image preloading
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch car details and similar cars
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch car details
        const response = await fetch(`/api/cars/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCarDetails(data);

        // Fetch similar cars based on make and model
        const similarResponse = await fetch(
          `/api/cars/similar?make=${data.make}&model=${data.model}&id=${params.id}`
        );
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarCars(similarData);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoadingError("Failed to load car details. Please try again later.");
        toast.error("Failed to load car details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  // Preload images
  useEffect(() => {
    if (carDetails?.images) {
      const imagePromises = carDetails.images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error("Error preloading images:", error);
          setImagesLoaded(true);
        });
    }
  }, [carDetails?.images]);

  // Format price with currency - updated to be more international
  const formatPrice = (price: number, currency: string) => {
    const currencyCode = getCurrencySymbol(currency);

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace(currencyCode, currency);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Navigate to previous image
  const prevImage = () => {
    if (!carDetails?.images) return;

    setActiveImageIndex((prev) =>
      prev === 0 ? carDetails.images.length - 1 : prev - 1
    );
  };

  // Navigate to next image
  const nextImage = () => {
    if (!carDetails?.images) return;

    setActiveImageIndex((prev) =>
      prev === carDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Share listing
  const shareListing = () => {
    if (navigator.share && carDetails) {
      navigator
        .share({
          title: carDetails.title,
          text: `Check out this ${carDetails.year} ${carDetails.make} ${
            carDetails.model
          } for ${formatPrice(carDetails.price, carDetails.currency || "$")}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // Scroll carousel left
  const scrollCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll carousel right
  const scrollCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If error, show error message
  if (loadingError || !carDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {loadingError || "Car not found"}
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn't find the car you're looking for. It may have been
                removed or the link is incorrect.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Other Cars
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Image Gallery */}
        <section className="relative h-[70vh] min-h-[600px] bg-gray-900">
          <div className="absolute inset-0">
            {carDetails.images && carDetails.images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={carDetails.images[activeImageIndex]}
                      alt={carDetails.title}
                   
                      className="object-cover"
                
                    />
                  </motion.div>
                </AnimatePresence>
                {!imagesLoaded && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-gray-400">Loading images...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Car size={64} className="text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>

          {/* Navigation Controls */}
          {carDetails.images && carDetails.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
              <button
                onClick={prevImage}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-white text-sm">
                {activeImageIndex + 1}/{carDetails.images.length}
              </div>
              <button
                onClick={nextImage}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          {/* Gallery Preview Button */}
          {carDetails.images && carDetails.images.length > 0 && (
            <button
              onClick={() => setPreviewMode(true)}
              className="absolute bottom-8 right-8 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-2"
            >
              <img size={20} />
              <span>View Gallery</span>
            </button>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                    {carDetails.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                    {carDetails.year}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {carDetails.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {carDetails.location}
                  </div>
                  <div className="flex items-center">
                    <Gauge size={16} className="mr-1" />
                    {formatNumber(carDetails.mileage)} mi
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {formatPrice(
                        carDetails.price,
                        carDetails.currency || "$"
                      )}
                    </h2>
                    {carDetails.downPayment > 0 && (
                      <p className="text-gray-600 mt-1">
                        Down payment:{" "}
                        {formatPrice(
                          carDetails.downPayment,
                          carDetails.currency || "$"
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 rounded-xl ${
                        isFavorite
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    </button>
                    <button
                      onClick={shareListing}
                      className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="text-sm">Year</span>
                    </div>
                    <div className="font-semibold">{carDetails.year}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Gauge size={16} />
                      <span className="text-sm">Mileage</span>
                    </div>
                    <div className="font-semibold">
                      {formatNumber(carDetails.mileage)} mi
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <CarFront size={16} />
                      <span className="text-sm">Transmission</span>
                    </div>
                    <div className="font-semibold">
                      {carDetails.transmission}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Fuel size={16} />
                      <span className="text-sm">Fuel Type</span>
                    </div>
                    <div className="font-semibold">{carDetails.fuelType}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    onClick={() => router.push(`/order/${carDetails.id}`)}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Contact Seller
                  </Button>
                </div>

                {showContact && carDetails.sellerInfo?.phone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <p className="font-medium text-blue-900">
                      {carDetails.sellerInfo.phone}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Mention you found this listing on Patriot Auto Sales
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Features Section */}
              {carDetails.features && carDetails.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles size={20} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Features
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carDetails.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <Check size={16} className="text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Description Section */}
              {carDetails.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText size={20} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Description
                    </h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {carDetails.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right Column - Seller Info & Similar Cars */}
            <div className="space-y-8">
              {/* Seller Info Card */}
              {carDetails.sellerInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Shield size={20} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Seller Information
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-semibold">
                      {carDetails.sellerInfo.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {carDetails.sellerInfo.name}
                        </h3>
                        {carDetails.sellerInfo.verified && (
                          <Shield size={16} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Member since {carDetails.sellerInfo.memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} />
                      <span>
                        Response time: {carDetails.sellerInfo.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={16} />
                      <span>{carDetails.sellerInfo.location}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Similar Cars Section */}
              {similarCars.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Car size={20} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Similar Cars
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {similarCars.slice(0, 3).map((car) => (
                      <Link
                        key={car.id}
                        href={`/car/${car.id}`}
                        className="block group"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <img
                                src={car.images[0]}
                                alt={car.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Car size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {car.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {car.year} • {formatNumber(car.mileage)} mi
                            </p>
                            <p className="font-semibold text-blue-600">
                              {formatPrice(car.price, car.currency || "$")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/shop?brand=${carDetails.make.toLowerCase()}&model=${carDetails.model.toLowerCase()}`}
                    className="mt-4 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View More Similar Cars
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Gallery Preview Modal */}
      <AnimatePresence>
        {previewMode && carDetails.images && carDetails.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 text-white">
              <h3 className="text-lg font-medium">
                {carDetails.title} - {activeImageIndex + 1}/
                {carDetails.images.length}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAllImages(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Maximize size={20} />
                  <span>Full Screen</span>
                </button>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close gallery"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center relative">
              <img
                src={carDetails.images[activeImageIndex]}
                alt={carDetails.title}
                fill
                className="object-contain"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {carDetails.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative cursor-pointer rounded-lg overflow-hidden ${
                      index === activeImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${carDetails.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Image Gallery Modal */}
      <AnimatePresence>
        {showAllImages && carDetails.images && carDetails.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 text-white">
              <h3 className="text-lg font-medium">
                {carDetails.title} - {activeImageIndex + 1}/
                {carDetails.images.length}
              </h3>
              <button
                onClick={() => setShowAllImages(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close gallery"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center relative">
              <img
                src={carDetails.images[activeImageIndex]}
                alt={carDetails.title}
                fill
                className="object-contain"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {carDetails.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative cursor-pointer rounded-lg overflow-hidden ${
                      index === activeImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${carDetails.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
