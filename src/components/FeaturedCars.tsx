"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Shield,
  Clock,
  Award,
  CreditCard,
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  Car,
  ChevronRight,
  Heart,
  Gauge,
  Calendar,
  Filter,
  Check,
  X,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface Car {
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
  area?: string;
  featured?: boolean;
  fuelType?: string;
}

export default function FeaturedCars() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const brandsContainerRef = useRef<HTMLDivElement>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [activePriceRange, setActivePriceRange] = useState<[number, number]>([
    0, 100000,
  ]);

  // State for cars data
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularBrands, setPopularBrands] = useState<
    {
      name: string;
      id: string;
      displayName: string;
      image: string;
      count: number;
    }[]
  >([]);

  // Brand normalization map - for consistent brand naming
  const brandNormalization: Record<string, string> = {
    chevy: "chevrolet",
    mercedes: "mercedes-benz",
    "mercedes benz": "mercedes-benz",
    "range rover": "land rover",
    leon: "seat",
    ram: "ram trucks",
  };

  // Helper function to format brand names properly for display
  const formatBrandName = (name: string): string => {
    // Special cases for acronyms and specific brands that should be uppercase
    const acronyms = ["bmw", "gmc", "kia", "ram"];
    if (acronyms.includes(name.toLowerCase())) {
      return name.toUpperCase();
    }

    // Handle hyphenated names like 'mercedes-benz'
    if (name.includes("-")) {
      return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
    }

    // Default case: capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Fetch cars data from backend - using the same approach as in shop page
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data);

        // Process the data to extract filter information
        processCarData(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to load cars. Please refresh the page.");
        toast.error("Failed to load featured cars.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Process car data to extract filter information - similar to shop page
  const processCarData = (carsData: Car[]) => {
    // Extract unique makes and count them
    const makeCount: Record<string, number> = {};

    carsData.forEach((car) => {
      // Count makes with normalization
      if (car.make) {
        // Normalize the brand name - convert to lowercase and trim
        let make = car.make.trim().toLowerCase();

        // Apply brand normalization if needed
        make = brandNormalization[make] || make;

        makeCount[make] = (makeCount[make] || 0) + 1;
      }
    });

    // Convert makes to array and sort by count
    const makesArray = Object.entries(makeCount).map(([name, count]) => ({
      name: name, // Original name (normalized)
      id: name.toLowerCase(), // ID for filtering (always lowercase)
      displayName: formatBrandName(name), // Formatted name for display
      count,
      image: getBrandLogoUrl(name),
    }));
    makesArray.sort((a, b) => b.count - a.count);

    // Get all brands for the filter
    const topBrands = makesArray.map((brand) => ({
      name: brand.name,
      id: brand.id,
      displayName: brand.displayName,
      image: brand.image,
      count: brand.count,
    }));

    setPopularBrands(topBrands);
  };

  // Navigate to shop page with selected brand filter
  const navigateToShopWithBrand = (brandId: string) => {
    router.push(`/shop?brand=${brandId}`);
  };

  // Navigate to shop page with selected price filter
  const navigateToShopWithPrice = (min: string, max: string) => {
    router.push(`/shop?min=${min}&max=${max}`);
  };

  // Format price with currency
  const formatPrice = (price: number, currency: string = "$") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("$", currency);
  };

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage) + " mi";
  };

  // Get featured cars from all cars
  const getFeaturedCars = () => {
    // First try to get cars marked as featured
    const featured = cars.filter((car) => car.featured === true);

    // If no cars are explicitly marked as featured, return the first 6 cars
    if (featured.length === 0) {
      return cars.slice(0, 6);
    }

    // Otherwise return the featured cars (max 6)
    return featured.slice(0, 6);
  };

  // Get featured cars
  const featuredCars = getFeaturedCars();

  // Filter cars based on selected brand and price
  const filteredCars = featuredCars.filter((car) => {
    // Normalize the car make for comparison
    const normalizedMake = car.make.trim().toLowerCase();
    const brandToCompare = brandNormalization[normalizedMake] || normalizedMake;

    if (selectedBrand && brandToCompare !== selectedBrand) return false;

    const price = car.price;

    // Check if price is within the active range
    if (price < activePriceRange[0] || price > activePriceRange[1])
      return false;

    return true;
  });

  // Get brand logo URL - using the same approach as in your shop page
  const getBrandLogoUrl = (brandName: string): string => {
    // Normalize brand name
    const normalizedName = brandName.toLowerCase().trim();
    // Map of common car brands to their logo URLs
    const brandLogoMap: Record<string, string> = {
      toyota: "https://www.carlogos.org/car-logos/toyota-logo.png",
      honda: "https://www.carlogos.org/car-logos/honda-logo.png",
      ford: "https://www.carlogos.org/car-logos/ford-logo.png",
      chevrolet: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
      chevy: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
      bmw: "https://www.carlogos.org/car-logos/bmw-logo.png",
      mercedes: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
      "mercedes-benz":
        "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
      audi: "https://www.carlogos.org/car-logos/audi-logo.png",
      nissan: "https://www.carlogos.org/car-logos/nissan-logo.png",
      hyundai: "https://www.carlogos.org/car-logos/hyundai-logo.png",
      kia: "https://www.carlogos.org/car-logos/kia-logo.png",
      volkswagen: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
      subaru: "https://www.carlogos.org/car-logos/subaru-logo.png",
      mazda: "https://www.carlogos.org/car-logos/mazda-logo.png",
      lexus: "https://www.carlogos.org/car-logos/lexus-logo.png",
      jeep: "https://www.carlogos.org/car-logos/jeep-logo.png",
      tesla: "https://www.carlogos.org/car-logos/tesla-logo.png",
      volvo: "https://www.carlogos.org/car-logos/volvo-logo.png",
      acura: "https://www.carlogos.org/car-logos/acura-logo.png",
      infiniti: "https://www.carlogos.org/car-logos/infiniti-logo.png",
      mitsubishi: "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
      rangerover: "https://www.carlogos.org/car-logos/rangerover-logo.png",
      buick: "https://www.carlogos.org/car-logos/buick-logo.png",
      cadillac: "https://www.carlogos.org/car-logos/cadillac-logo.png",
      chrysler: "https://www.carlogos.org/car-logos/chrysler-logo.png",
      dodge: "https://www.carlogos.org/car-logos/dodge-logo.png",
      gmc: "https://www.carlogos.org/car-logos/gmc-logo.png",
      ram: "https://www.carlogos.org/car-logos/ram-logo.png",
      porsche: "https://www.carlogos.org/car-logos/porsche-logo.png",
      jaguar: "https://www.carlogos.org/car-logos/jaguar-logo.png",
      "land rover": "https://www.carlogos.org/car-logos/land-rover-logo.png",
      mini: "https://www.carlogos.org/car-logos/mini-logo.png",
      fiat: "https://www.carlogos.org/car-logos/fiat-logo.png",
      "alfa romeo": "https://www.carlogos.org/car-logos/alfa-romeo-logo.png",
      maserati: "https://www.carlogos.org/car-logos/maserati-logo.png",
      bentley: "https://www.carlogos.org/car-logos/bentley-logo.png",
      "rolls-royce": "https://www.carlogos.org/car-logos/rolls-royce-logo.png",
      "aston martin":
        "https://www.carlogos.org/car-logos/aston-martin-logo.png",
      lamborghini: "https://www.carlogos.org/car-logos/lamborghini-logo.png",
      ferrari: "https://www.carlogos.org/car-logos/ferrari-logo.png",
      bugatti: "https://www.carlogos.org/car-logos/bugatti-logo.png",
      seat: "https://www.carlogos.org/car-logos/seat-logo.png",
      "ram trucks": "https://www.carlogos.org/car-logos/ram-logo.png",
    };

    // Return the logo URL if found, otherwise return a generic car icon
    return (
      brandLogoMap[normalizedName] ||
      `/brands/${normalizedName}.png` ||
      `/brands/generic-car.png`
    );
  };

  // Handle price range selection
  const handlePriceRangeSelect = (min: number, max: number) => {
    setActivePriceRange([min, max]);
    setPriceFilter(`${min}-${max}`);

    // Navigate to shop with price filter
    navigateToShopWithPrice(min.toString(), max.toString());
  };

  return (
    <>
      {/* Premium Car Marketplace Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              Curated Selection
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 text-gray-900">
              Find Your Perfect <span className="text-blue-600">Drive</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Discover a curated selection of quality vehicles from trusted
              dealers and private sellers across the country.
            </p>
          </motion.div>

          {/* Brand Logos - Unique Hexagon Grid Design */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                <span className="bg-blue-600 text-white p-1.5 rounded-md mr-2">
                  <Car size={16} />
                </span>
                Popular Brands
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-blue-600 border-blue-200"
              >
                {showAllBrands ? "Show Less" : "View All"}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-6 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <motion.div
                className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                  {(showAllBrands
                    ? popularBrands
                    : popularBrands.slice(0, 16)
                  ).map((brand, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <button
                        onClick={() => {
                          if (selectedBrand === brand.id) {
                            setSelectedBrand(null);
                          } else {
                            setSelectedBrand(brand.id);
                            navigateToShopWithBrand(brand.id);
                          }
                        }}
                        className={`relative w-16 h-16 md:w-20 md:h-20 ${
                          selectedBrand === brand.id
                            ? "ring-2 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        }}
                      >
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            selectedBrand === brand.id
                              ? "bg-blue-50"
                              : "bg-gray-50 hover:bg-blue-50"
                          } transition-colors`}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                            <Image
                              src={brand.image}
                              alt={brand.displayName}
                              width={40}
                              height={40}
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className =
                                    "w-full h-full flex items-center justify-center text-blue-600 font-bold text-xl";
                                  fallback.textContent = brand.displayName
                                    .charAt(0)
                                    .toUpperCase();
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        </div>
                        {selectedBrand === brand.id && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                      <p className="text-xs font-bold mt-2 text-center">
                        {brand.displayName}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Brand selection indicator */}
                {selectedBrand && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Selected brand:
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium flex items-center">
                        {
                          popularBrands.find((b) => b.id === selectedBrand)
                            ?.displayName
                        }
                        <button
                          onClick={() => setSelectedBrand(null)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() =>
                        router.push(`/shop?brand=${selectedBrand}`)
                      }
                      className="text-blue-600"
                    >
                      View all{" "}
                      {
                        popularBrands.find((b) => b.id === selectedBrand)
                          ?.displayName
                      }{" "}
                      cars
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Price Range Filter - Interactive Slider Design */}
          <motion.div
            className="mb-16 bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-2xl shadow-lg text-white overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mt-20 -mr-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -mb-20 -ml-20" />

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
                <DollarSign size={24} className="mr-2" />
                What's your budget?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <PriceRangeButton
                  label="Any Price"
                  isActive={
                    activePriceRange[0] === 0 && activePriceRange[1] === 100000
                  }
                  onClick={() => handlePriceRangeSelect(0, 100000)}
                />
                <PriceRangeButton
                  label="Under $5,000"
                  isActive={
                    activePriceRange[0] === 0 && activePriceRange[1] === 5000
                  }
                  onClick={() => handlePriceRangeSelect(0, 5000)}
                />
                <PriceRangeButton
                  label="$5,000 - $10,000"
                  isActive={
                    activePriceRange[0] === 5000 &&
                    activePriceRange[1] === 10000
                  }
                  onClick={() => handlePriceRangeSelect(5000, 10000)}
                />
                <PriceRangeButton
                  label="$10,000 - $20,000"
                  isActive={
                    activePriceRange[0] === 10000 &&
                    activePriceRange[1] === 20000
                  }
                  onClick={() => handlePriceRangeSelect(10000, 20000)}
                />
                <PriceRangeButton
                  label="$20,000+"
                  isActive={
                    activePriceRange[0] === 20000 &&
                    activePriceRange[1] === 100000
                  }
                  onClick={() => handlePriceRangeSelect(20000, 100000)}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-blue-100 text-sm">
                  <Filter size={16} className="inline mr-1" />
                  Filter by price to find the perfect car for your budget
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push("/shop")}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Advanced Filters
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Car Listings - Simplified Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Loading featured cars...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 mb-2">{error}</p>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setHoveredCard(car.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={`/car/${car.id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-200 bg-white cursor-pointer h-full rounded-xl">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                        {car.images && car.images.length > 0 ? (
                          <motion.div
                            animate={{
                              scale: hoveredCard === car.id ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full"
                          >
                            <Image
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              priority={true}
                            />
                          </motion.div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Car size={48} />
                          </div>
                        )}

                        {/* Overlay with brand logo and price */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Brand Logo */}
                        <div className="absolute top-3 left-3 bg-white p-2 shadow-md rounded-full">
                          <Image
                            src={getBrandLogoUrl(car.make)}
                            alt={car.make}
                            width={24}
                            height={24}
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                fallback.className =
                                  "w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-500 font-semibold rounded-full";
                                fallback.textContent = car.make
                                  .charAt(0)
                                  .toUpperCase();
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded-md shadow-sm">
                          {formatPrice(car.price, car.currency)}
                        </div>

                        {/* Condition Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-blue-800 px-2 py-0.5 text-xs font-medium rounded-md">
                          {car.condition}
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Car Title */}
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                          {formatBrandName(car.make)} {car.model} {car.year}
                        </h3>

                        {/* Location */}
                        {/* <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{car.location}</span>
                        </div> */}

                        {/* Key Specs */}
                        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
                          <div className="flex items-center">
                            <Gauge size={14} className="mr-1" />
                            <span>{formatMileage(car.mileage)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <path d="M5 9h14M9 5v14M4 4h16v16H4z" />
                            </svg>
                            <span>{car.transmission}</span>
                          </div>
                        </div>
                      </div>

                      {/* View Details Button - Only visible on hover */}
                      <AnimatePresence>
                        {hoveredCard === car.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              View Details
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!isLoading && !error && filteredCars.length === 0 && (
            <motion.div
              className="text-center py-16 bg-white mt-6 border border-gray-200 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-blue-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                No cars match your criteria
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your filters or browse all available cars in our
                inventory
              </p>
              <Button
                onClick={() => {
                  setSelectedBrand(null);
                  setPriceFilter("all");
                  setActivePriceRange([0, 100000]);
                  router.push("/shop");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* View All Button */}
          {!isLoading && !error && filteredCars.length > 0 && (
            <motion.div
              className="text-center mt-12 md:mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/shop">
                <Button className="px-8 py-6 bg-transparent hover:bg-transparent underline shadow-none font-medium inline-flex items-center text-blue-800 ">
                  Browse All Cars
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Our Marketplace - Redesigned Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-blue-900 opacity-95 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl z-0"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl z-0"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
          <motion.div
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="bg-blue-500/20 text-blue-200 text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-sm border border-blue-400/20">
              The CarMarket Advantage
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-6 text-white leading-tight">
              Redefining Your Car Buying{" "}
              <span className="text-blue-400">Experience</span>
            </h2>
            <p className="text-blue-100 max-w-3xl mx-auto text-lg opacity-90">
              We've reimagined every aspect of finding and purchasing your next
              vehicle to create a seamless journey from search to keys-in-hand.
            </p>
          </motion.div>

          {/* Stats section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                12K+
              </div>
              <div className="text-blue-200 text-sm">Verified Vehicles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                98%
              </div>
              <div className="text-blue-200 text-sm">Customer Satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                200+
              </div>
              <div className="text-blue-200 text-sm">Inspection Points</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-blue-200 text-sm">Expert Support</div>
            </div>
          </motion.div>

          {/* Main features with interactive tabs */}
          <div className="mb-20">
            <Tabs defaultValue="quality" className="w-full">
              <div className="flex flex-col md:flex-row gap-8">
                <motion.div
                  className="md:w-1/3"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-2">
                    <TabsTrigger
                      value="quality"
                      className="w-full px-6 py-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white/10 backdrop-blur-md text-blue-100 rounded-xl border border-white/10 text-left flex items-start justify-between hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                          <Shield size={20} className="text-blue-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            Quality Assurance
                          </div>
                          <div className="text-sm opacity-80 hidden md:block">
                            Rigorous inspection process
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="mt-1" />
                    </TabsTrigger>

                    <TabsTrigger
                      value="financing"
                      className="w-full px-6 py-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white/10 backdrop-blur-md text-blue-100 rounded-xl border border-white/10 text-left flex items-start justify-between hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                          <CreditCard size={20} className="text-blue-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            Smart Financing
                          </div>
                          <div className="text-sm opacity-80 hidden md:block">
                            Competitive rates & flexibility
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="mt-1" />
                    </TabsTrigger>

                    <TabsTrigger
                      value="support"
                      className="w-full px-6 py-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white/10 backdrop-blur-md text-blue-100 rounded-xl border border-white/10 text-left flex items-start justify-between hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                          <Clock size={20} className="text-blue-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            Dedicated Support
                          </div>
                          <div className="text-sm opacity-80 hidden md:block">
                            Expert guidance at every step
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="mt-1" />
                    </TabsTrigger>

                    <TabsTrigger
                      value="guarantee"
                      className="w-full px-6 py-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white/10 backdrop-blur-md text-blue-100 rounded-xl border border-white/10 text-left flex items-start justify-between hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                          <Award size={20} className="text-blue-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            Buyer Protection
                          </div>
                          <div className="text-sm opacity-80 hidden md:block">
                            Comprehensive guarantees
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="mt-1" />
                    </TabsTrigger>
                  </TabsList>
                </motion.div>

                <motion.div
                  className="md:w-2/3"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <TabsContent value="quality" className="mt-0">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Shield size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white ml-6">
                          200+ Point Vehicle Inspection
                        </h3>
                      </div>

                      <p className="text-blue-100 mb-6">
                        Every vehicle in our marketplace undergoes a
                        comprehensive 200+ point inspection conducted by
                        ASE-certified technicians. We examine everything from
                        engine performance to cosmetic details to ensure you're
                        getting a quality vehicle.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Mechanical inspection
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Electrical systems check
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Interior & exterior evaluation
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Road test performance
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Full history report included
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check size={18} className="text-blue-400 mr-2" />
                          <span className="text-blue-100">
                            Safety feature verification
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financing" className="mt-0">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <CreditCard size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white ml-6">
                          Flexible Financing Options
                        </h3>
                      </div>

                      <p className="text-blue-100 mb-6">
                        We've partnered with over 20 leading financial
                        institutions to provide you with competitive rates and
                        flexible terms tailored to your specific financial
                        situation. Our digital application process makes
                        securing financing quick and hassle-free.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2">
                            Low APR Programs
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Rates starting from 2.9% APR for qualified buyers
                            with excellent credit.
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2">
                            First-Time Buyer Program
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Special financing options available for first-time
                            car buyers with limited credit history.
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2">
                            Trade-In Value Boost
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Get up to $1,000 additional value when you trade in
                            your current vehicle.
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2">
                            Flexible Terms
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Choose from 24-84 month terms to fit your budget and
                            financial goals.
                          </p>
                        </div>
                      </div>

                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Calculate your payment
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="support" className="mt-0">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Clock size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white ml-6">
                          Expert Support Team
                        </h3>
                      </div>

                      <p className="text-blue-100 mb-6">
                        Our dedicated team of automotive experts is available
                        24/7 to guide you through every step of your car buying
                        journey. From answering technical questions to helping
                        with paperwork, we're here to make your experience
                        seamless.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-300"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                          <h4 className="font-semibold text-white mb-1">
                            Phone Support
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Available 24/7
                          </p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-300"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <h4 className="font-semibold text-white mb-1">
                            Live Chat
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Instant responses
                          </p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-300"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </div>
                          <h4 className="font-semibold text-white mb-1">
                            Email
                          </h4>
                          <p className="text-blue-100 text-sm">
                            Detailed assistance
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30 flex items-start mb-6">
                        <div className="mr-4 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-300"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                        <p className="text-blue-100 text-sm">
                          Our support team includes ASE-certified mechanics,
                          finance specialists, and automotive experts with an
                          average of 15+ years of industry experience.
                        </p>
                      </div>

                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Contact support team
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="guarantee" className="mt-0">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white ml-6">
                          Comprehensive Buyer Protection
                        </h3>
                      </div>

                      <p className="text-blue-100 mb-6">
                        We stand behind every vehicle on our marketplace with
                        industry-leading guarantees and protections designed to
                        give you complete peace of mind with your purchase.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-3">
                              1
                            </span>
                            7-Day Money-Back Guarantee
                          </h4>
                          <p className="text-blue-100 text-sm pl-9">
                            If you're not completely satisfied with your vehicle
                            for any reason, return it within 7 days for a full
                            refund.
                          </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-3">
                              2
                            </span>
                            90-Day Comprehensive Warranty
                          </h4>
                          <p className="text-blue-100 text-sm pl-9">
                            Every vehicle comes with a 90-day/4,000-mile
                            warranty covering thousands of components.
                          </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-3">
                              3
                            </span>
                            Extended Protection Plans
                          </h4>
                          <p className="text-blue-100 text-sm pl-9">
                            Choose from multiple protection plans that extend
                            coverage up to 100,000 additional miles.
                          </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-3">
                              4
                            </span>
                            Transparent History Reports
                          </h4>
                          <p className="text-blue-100 text-sm pl-9">
                            Full vehicle history reports included with every
                            listing, showing accidents, service records, and
                            ownership history.
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => router.push("/about")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Learn more about our guarantees
                      </Button>
                    </div>
                  </TabsContent>
                </motion.div>
              </div>
            </Tabs>
          </div>

          {/* Call to action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-12 rounded-2xl border border-blue-500/30 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to find your perfect car?
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have discovered the
                easiest way to buy a quality vehicle online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-medium px-8 py-6 text-lg"
                >
                  Browse inventory
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add custom styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

// Price Range Button Component
function PriceRangeButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-white text-blue-600 shadow-md transform scale-105"
          : "bg-blue-500/30 text-white hover:bg-blue-500/50"
      }`}
    >
      {label}
    </button>
  );
}
