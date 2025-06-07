"use client";
import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Grid,
  List,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Car,
  X,
  Loader2,
  Scale,
  Heart,
  Camera,
  Calendar,
  Gauge,
  Badge,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
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
  description: string;
  createdAt: string;
};

function ShopPage() {
  // Get URL search parameters and router
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);

  // State for expanded filter sections
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    make: true,
    year: true,
    condition: true,
    transmission: true,
  });

  // View mode (grid or list)
  const [viewMode, setViewMode] = useState("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 9 : 6; // Different counts based on view mode

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Price range state - initialize with URL params if available
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
  });

  // Add this function to handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results when changing page
    window.scrollTo({
      top: document.getElementById("results-heading")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Selected filters state
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    priceRange: null,
    year: null,
    condition: [],
    transmission: [],
  });

  // State for cars data
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popularBrands, setPopularBrands] = useState<
    { name: string; image: string; count: number }[]
  >([]);
  const [filterData, setFilterData] = useState({
    priceRanges: [
      { label: "Under $5,000", min: 0, max: 5000, count: 0 },
      { label: "Under $20,000", min: 0, max: 20000, count: 0 },
      { label: "$20,000 - $30,000", min: 20000, max: 30000, count: 0 },
      { label: "$30,000 - $40,000", min: 30000, max: 40000, count: 0 },
      { label: "$40,000 - $50,000", min: 40000, max: 50000, count: 0 },
      { label: "More than $50,000", min: 50000, max: 1000000, count: 0 },
    ],
    makes: [],
    yearRanges: [
      { label: "2021 - 2023", min: 2021, max: 2023, count: 0 },
      { label: "2018 - 2020", min: 2018, max: 2020, count: 0 },
      { label: "2015 - 2017", min: 2015, max: 2017, count: 0 },
      { label: "2012 - 2014", min: 2012, max: 2014, count: 0 },
      { label: "Older than 2012", min: 0, max: 2011, count: 0 },
    ],
    conditions: [],
    transmissions: [],
  });

  // Apply URL parameters on component mount
  useEffect(() => {
    // Handle brand filter from URL
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      // Convert brand param to proper case for matching
      const brandName = getBrandNameFromParam(brandParam);
      if (brandName) {
        setSelectedFilters((prev) => ({
          ...prev,
          brands: [brandName],
        }));
      }
    }

    // Handle price range from URL
    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    if (minPrice && maxPrice) {
      setPriceRange({
        min: minPrice,
        max: maxPrice,
      });
    }

    // Handle condition from URL
    const conditionParam = searchParams.get("condition");
    if (conditionParam) {
      setSelectedFilters((prev) => ({
        ...prev,
        condition: [conditionParam],
      }));
    }

    // Handle transmission from URL
    const transmissionParam = searchParams.get("transmission");
    if (transmissionParam) {
      setSelectedFilters((prev) => ({
        ...prev,
        transmission: [transmissionParam],
      }));
    }

    // Handle search query from URL
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  // Close filter sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showFilters && window.innerWidth < 1024) {
        // Check if the click is outside the filter sidebar
        const sidebar = document.getElementById("filter-sidebar");
        const target = e.target as HTMLElement;
        if (
          sidebar &&
          !sidebar.contains(target) &&
          !target.closest("[data-filter-toggle]")
        ) {
          setShowFilters(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilters]);

  // Fetch cars data from backend
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
        toast.error("Failed to load cars. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Brand normalization map - for consistent brand naming
  const brandNormalization: Record<string, string> = {
    chevy: "chevrolet",
    mercedes: "mercedes-benz",
    "mercedes benz": "mercedes-benz",
    "range rover": "land rover",
    "land rover": "land rover",
    leon: "seat",
    ram: "ram trucks",
    bmw: "bmw",
    kia: "kia",
    hyundai: "hyundai",
    toyota: "toyota",
    honda: "honda",
    ford: "ford",
    jeep: "jeep",
    dodge: "dodge",
    nissan: "nissan",
    audi: "audi",
    lexus: "lexus",
    cadillac: "cadillac",
    porsche: "porsche",
    bentley: "bentley",
    tesla: "tesla",
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

  // Process car data to extract filter information
  const processCarData = (carsData: Car[]) => {
    // Extract unique makes and count them
    const makeCount: Record<string, number> = {};
    const priceRangeCounts = [0, 0, 0, 0, 0]; // For price ranges
    const yearRangeCounts = [0, 0, 0, 0, 0]; // For year ranges
    const conditionCount: Record<string, number> = {};
    const transmissionCount: Record<string, number> = {};

    carsData.forEach((car) => {
      // Count makes with normalization
      if (car.make) {
        // Normalize the brand name - convert to lowercase and trim
        let make = car.make.trim().toLowerCase();

        // Apply brand normalization if needed
        make = brandNormalization[make] || make;

        makeCount[make] = (makeCount[make] || 0) + 1;
      }

      // Count price ranges
      const price = car.price || 0;
      if (price < 5000) {
        priceRangeCounts[0]++;
      } else if (price < 20000) {
        priceRangeCounts[1]++;
      } else if (price < 30000) {
        priceRangeCounts[2]++;
      } else if (price < 40000) {
        priceRangeCounts[3]++;
      } else if (price < 50000) {
        priceRangeCounts[4]++;
      } else {
        // More than 50000
        priceRangeCounts[5] = (priceRangeCounts[5] || 0) + 1;
      }

      // Count year ranges
      const year = car.year || 0;
      if (year >= 2021) {
        yearRangeCounts[0]++;
      } else if (year >= 2018) {
        yearRangeCounts[1]++;
      } else if (year >= 2015) {
        yearRangeCounts[2]++;
      } else if (year >= 2012) {
        yearRangeCounts[3]++;
      } else {
        yearRangeCounts[4]++;
      }

      // Count conditions
      if (car.condition) {
        conditionCount[car.condition] =
          (conditionCount[car.condition] || 0) + 1;
      }

      // Count transmissions
      if (car.transmission) {
        transmissionCount[car.transmission] =
          (transmissionCount[car.transmission] || 0) + 1;
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

    // Get top brands for the quick filter
    const topBrands = makesArray.map((brand) => ({
      name: brand.name,
      id: brand.id,
      displayName: brand.displayName,
      image: brand.image,
      count: brand.count,
    }));

    // Update price ranges
    const updatedPriceRanges = filterData.priceRanges.map((range, index) => ({
      ...range,
      count: priceRangeCounts[index],
    }));

    // Update year ranges
    const updatedYearRanges = filterData.yearRanges.map((range, index) => ({
      ...range,
      count: yearRangeCounts[index],
    }));

    // Convert conditions to array
    const conditionsArray = Object.entries(conditionCount).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
    conditionsArray.sort((a, b) => b.count - a.count);

    // Convert transmissions to array
    const transmissionsArray = Object.entries(transmissionCount).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
    transmissionsArray.sort((a, b) => b.count - a.count);

    setPopularBrands(topBrands);

    // Update the rest of your filter data
    setFilterData({
      priceRanges: updatedPriceRanges,
      makes: makesArray,
      yearRanges: updatedYearRanges,
      conditions: conditionsArray,
      transmissions: transmissionsArray,
    });
  };

  // Helper function to get brand logo URL
  const getBrandLogoUrl = (brandName: string): string => {
    // Normalize brand name
    const normalizedName = brandName.toLowerCase().trim();

    // Map of common car brands to their logo URLs
    const brandLogoMap: Record<string, string> = {
      toyota: "https://www.carlogos.org/car-logos/toyota-logo.png",
      honda: "https://www.carlogos.org/car-logos/honda-logo.png",
      ford: "https://www.carlogos.org/car-logos/ford-logo.png",
      chevrolet: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
      bmw: "https://www.carlogos.org/car-logos/bmw-logo.png",
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
      buick: "https://www.carlogos.org/car-logos/buick-logo.png",
      cadillac: "https://www.carlogos.org/car-logos/cadillac-logo.png",
      chrysler: "https://www.carlogos.org/car-logos/chrysler-logo.png",
      dodge: "https://www.carlogos.org/car-logos/dodge-logo.png",
      gmc: "https://www.carlogos.org/car-logos/gmc-logo.png",
      ram: "https://www.carlogos.org/car-logos/ram-logo.png",
      "ram trucks": "https://www.carlogos.org/car-logos/ram-logo.png",
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
    };

    // Return the logo URL if found, otherwise return a generic car icon
    return (
      brandLogoMap[normalizedName] ||
      `/brands/${normalizedName}.png` ||
      `/brands/generic-car.png`
    );
  };

  // Helper function to convert brand parameter to proper brand name
  const getBrandNameFromParam = (param: string) => {
    // Normalize the brand name
    const normalizedParam = param.toLowerCase().trim();
    const brandId = brandNormalization[normalizedParam] || normalizedParam;

    // Format for display
    return formatBrandName(brandId);
  };

  // Toggle filter section
  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Handle brand selection
  const handleBrandSelect = (brandName: string) => {
    // Normalize the brand name
    const normalizedBrand = brandName.toLowerCase().trim();
    const brandId = brandNormalization[normalizedBrand] || normalizedBrand;

    setSelectedFilters((prev) => {
      // If brand is already selected, remove it
      if (prev.brands.includes(brandId)) {
        return {
          ...prev,
          brands: prev.brands.filter((brand) => brand !== brandId),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prev,
          brands: [...prev.brands, brandId],
        };
      }
    });
  };

  // Filter cars based on selected filters
  const getFilteredCars = () => {
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (car) =>
          car.title.toLowerCase().includes(query) ||
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.description.toLowerCase().includes(query)
      );
    }

    // Filter by brand with normalization
    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.brands.some((brand) => {
          // Normalize the car make for comparison
          const normalizedMake = car.make.trim().toLowerCase();
          const carBrandId =
            brandNormalization[normalizedMake] || normalizedMake;

          return (
            carBrandId === brand ||
            car.title.toLowerCase().includes(brand.toLowerCase())
          );
        })
      );
    }

    // Filter by price range
    if (priceRange.min && priceRange.max) {
      filtered = filtered.filter(
        (car) =>
          car.price >= parseInt(priceRange.min) &&
          car.price <= parseInt(priceRange.max)
      );
    }

    // Filter by condition
    if (selectedFilters.condition.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.condition.includes(car.condition)
      );
    }

    // Filter by transmission
    if (selectedFilters.transmission.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.transmission.includes(car.transmission)
      );
    }

    return filtered;
  };

  // Navigate to car detail page
  const navigateToCarDetail = (carId: string) => {
    router.push(`/car/${carId}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to page 1 when searching
    setCurrentPage(1);

    // Update URL with search query
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }

    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  // Get filtered cars
  const filteredCars = getFilteredCars();

  // Get paginated cars for display
  const getPaginatedCars = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedCars = getPaginatedCars();

  // Handle price range selection
  const handlePriceRangeSelect = (min: number, max: number) => {
    setPriceRange({ min: min.toString(), max: max.toString() });
  };

  // Handle condition selection
  const handleConditionSelect = (condition: string) => {
    setSelectedFilters((prev) => {
      if (prev.condition.includes(condition)) {
        return {
          ...prev,
          condition: prev.condition.filter((c) => c !== condition),
        };
      } else {
        return {
          ...prev,
          condition: [...prev.condition, condition],
        };
      }
    });
  };

  // Handle transmission selection
  const handleTransmissionSelect = (transmission: string) => {
    setSelectedFilters((prev) => {
      if (prev.transmission.includes(transmission)) {
        return {
          ...prev,
          transmission: prev.transmission.filter((t) => t !== transmission),
        };
      } else {
        return {
          ...prev,
          transmission: [...prev.transmission, transmission],
        };
      }
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A";
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      priceRange: null,
      year: null,
      condition: [],
      transmission: [],
    });
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");

    // Update URL to remove query parameters
    window.history.replaceState({}, "", "/shop");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="font-medium text-gray-700">Browse Vehicles</span>
          </div>

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-6">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-gray-700"
              >
                <Filter size={18} />
                Filters
                {selectedFilters.brands.length +
                  selectedFilters.condition.length +
                  selectedFilters.transmission.length +
                  (priceRange.min && priceRange.max ? 1 : 0) >
                  0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.brands.length +
                      selectedFilters.condition.length +
                      selectedFilters.transmission.length +
                      (priceRange.min && priceRange.max ? 1 : 0)}
                  </span>
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  className={`${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  } px-3 shadow-sm`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={18} />
                </Button>
                <Button
                  className={`${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  } px-3 shadow-sm`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading inventory...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile filter overlay */}
              {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
              )}

              {/* Sidebar filters */}
              <div
                id="filter-sidebar"
                className={`lg:w-1/4 fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transform ${
                  showFilters ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 ease-in-out w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/4 bg-white h-full lg:h-auto overflow-y-auto`}
              >
                <div className="sticky top-0 bg-white p-5 border-b lg:border-b-0 lg:rounded-xl lg:shadow-md lg:border">
                  {/* Mobile filter header */}
                  <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Filter header with clear button */}
                  <div className="hidden lg:flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Filters
                    </h3>
                    {(selectedFilters.brands.length > 0 ||
                      selectedFilters.condition.length > 0 ||
                      selectedFilters.transmission.length > 0 ||
                      (priceRange.min && priceRange.max) ||
                      searchQuery) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Selected filters display */}
                  {(selectedFilters.brands.length > 0 ||
                    selectedFilters.condition.length > 0 ||
                    selectedFilters.transmission.length > 0 ||
                    (priceRange.min && priceRange.max) ||
                    searchQuery) && (
                    <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="text-xs uppercase text-blue-700 font-semibold mb-2">
                        Active Filters
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <div className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm border border-blue-200">
                            Search: {searchQuery}
                            <button
                              onClick={() => setSearchQuery("")}
                              className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        {selectedFilters.brands.map((brand) => {
                          // Get the display name for the brand
                          const displayName = formatBrandName(brand);

                          return (
                            <div
                              key={brand}
                              className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm border border-blue-200"
                            >
                              {displayName}
                              <button
                                onClick={() => handleBrandSelect(brand)}
                                className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                        {priceRange.min && priceRange.max && (
                          <div className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm border border-blue-200">
                            {formatPrice(parseInt(priceRange.min))} -{" "}
                            {formatPrice(parseInt(priceRange.max))}
                            <button
                              onClick={() =>
                                setPriceRange({ min: "", max: "" })
                              }
                              className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        {selectedFilters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm border border-blue-200"
                          >
                            {condition}
                            <button
                              onClick={() => handleConditionSelect(condition)}
                              className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {selectedFilters.transmission.map((transmission) => (
                          <div
                            key={transmission}
                            className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm border border-blue-200"
                          >
                            {transmission}
                            <button
                              onClick={() =>
                                handleTransmissionSelect(transmission)
                              }
                              className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4 pb-2 border-b border-gray-100"
                      onClick={() => toggleFilter("make")}
                    >
                      <h3 className="font-medium text-gray-900">Brand</h3>
                      <div className="bg-gray-100 rounded-full p-1">
                        {expandedFilters.make ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {expandedFilters.make && (
                      <>
                        <div className="relative mb-4">
                          <input
                            type="text"
                            placeholder="Find Brand"
                            className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          />
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                        </div>

                        <div className="max-h-52 overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {filterData.makes.map((make, index) => (
                            <div
                              key={index}
                              className="flex items-center hover:bg-gray-50 p-1 rounded-md -mx-1"
                            >
                              <input
                                type="checkbox"
                                id={`make-${index}`}
                                checked={selectedFilters.brands.includes(
                                  make.name
                                )}
                                onChange={() => handleBrandSelect(make.name)}
                                className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`make-${index}`}
                                className="text-sm text-gray-700 flex-grow cursor-pointer"
                              >
                                {make.displayName}
                              </label>
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {make.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4 pb-2 border-b border-gray-100"
                      onClick={() => toggleFilter("price")}
                    >
                      <h3 className="font-medium text-gray-900">Price Range</h3>
                      <div className="bg-gray-100 rounded-full p-1">
                        {expandedFilters.price ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {expandedFilters.price && (
                      <>
                        <div className="flex gap-3 mb-4">
                          <div className="w-1/2">
                            <label className="block text-xs text-gray-500 mb-1.5">
                              Minimum
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={priceRange.min}
                                onChange={(e) =>
                                  setPriceRange({
                                    ...priceRange,
                                    min: e.target.value.replace(/\D/g, ""),
                                  })
                                }
                                className="w-full p-2.5 pl-7 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs text-gray-500 mb-1.5">
                              Maximum
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={priceRange.max}
                                onChange={(e) =>
                                  setPriceRange({
                                    ...priceRange,
                                    max: e.target.value.replace(/\D/g, ""),
                                  })
                                }
                                className="w-full p-2.5 pl-7 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                          {filterData.priceRanges.map((range, index) => (
                            <div
                              key={index}
                              className="flex items-center hover:bg-gray-50 p-1 rounded-md -mx-1"
                            >
                              <input
                                type="radio"
                                id={`price-${index}`}
                                name="price-range"
                                checked={
                                  priceRange.min === range.min.toString() &&
                                  priceRange.max === range.max.toString()
                                }
                                onChange={() =>
                                  handlePriceRangeSelect(range.min, range.max)
                                }
                                className="mr-3 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`price-${index}`}
                                className="text-sm text-gray-700 flex-grow cursor-pointer"
                              >
                                {range.label}
                              </label>
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {range.count}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm py-1.5 px-3 h-auto border-gray-300"
                            onClick={() => setPriceRange({ min: "", max: "" })}
                          >
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-sm py-1.5 px-3 h-auto"
                          >
                            Apply
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Year filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4 pb-2 border-b border-gray-100"
                      onClick={() => toggleFilter("year")}
                    >
                      <h3 className="font-medium text-gray-900">Year</h3>
                      <div className="bg-gray-100 rounded-full p-1">
                        {expandedFilters.year ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {expandedFilters.year && (
                      <div className="space-y-2.5 mb-4">
                        {filterData.yearRanges.map((range, index) => (
                          <div
                            key={index}
                            className="flex items-center hover:bg-gray-50 p-1 rounded-md -mx-1"
                          >
                            <input
                              type="radio"
                              id={`year-${index}`}
                              name="year-range"
                              className="mr-3 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`year-${index}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {range.label}
                            </label>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {range.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Condition filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4 pb-2 border-b border-gray-100"
                      onClick={() => toggleFilter("condition")}
                    >
                      <h3 className="font-medium text-gray-900">Condition</h3>
                      <div className="bg-gray-100 rounded-full p-1">
                        {expandedFilters.condition ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {expandedFilters.condition && (
                      <div className="space-y-2.5 mb-4">
                        {filterData.conditions.map((condition, index) => (
                          <div
                            key={index}
                            className="flex items-center hover:bg-gray-50 p-1 rounded-md -mx-1"
                          >
                            <input
                              type="checkbox"
                              id={`condition-${index}`}
                              checked={selectedFilters.condition.includes(
                                condition.name
                              )}
                              onChange={() =>
                                handleConditionSelect(condition.name)
                              }
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`condition-${index}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {condition.name}
                            </label>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {condition.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transmission filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4 pb-2 border-b border-gray-100"
                      onClick={() => toggleFilter("transmission")}
                    >
                      <h3 className="font-medium text-gray-900">
                        Transmission
                      </h3>
                      <div className="bg-gray-100 rounded-full p-1">
                        {expandedFilters.transmission ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {expandedFilters.transmission && (
                      <div className="space-y-2.5 mb-4">
                        {filterData.transmissions.map((transmission, index) => (
                          <div
                            key={index}
                            className="flex items-center hover:bg-gray-50 p-1 rounded-md -mx-1"
                          >
                            <input
                              type="checkbox"
                              id={`transmission-${index}`}
                              checked={selectedFilters.transmission.includes(
                                transmission.name
                              )}
                              onChange={() =>
                                handleTransmissionSelect(transmission.name)
                              }
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`transmission-${index}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {transmission.name}
                            </label>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {transmission.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile apply button */}
                  <div className="mt-8 lg:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:w-3/4">
                {/* Desktop controls */}
                <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900 mr-3">
                      {filteredCars.length} vehicles
                    </h2>
                    <span className="text-sm text-gray-500">
                      found based on your filters
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Sort by:
                      </span>
                      <select className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Newest first</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Mileage: Low to High</option>
                        <option>Year: Newest first</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className={`${
                          viewMode === "grid"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        } px-3`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid size={18} />
                      </Button>
                      <Button
                        className={`${
                          viewMode === "list"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        } px-3`}
                        onClick={() => setViewMode("list")}
                      >
                        <List size={18} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick price filters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
                  <Button
                    className={`${
                      priceRange.min === "0" && priceRange.max === "5000"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    } text-xs md:text-sm py-2 h-auto shadow-sm rounded-lg`}
                    onClick={() => handlePriceRangeSelect(0, 5000)}
                  >
                    <span className="truncate">Under $5,000</span>
                  </Button>
                  {filterData.priceRanges.slice(1, 5).map((range, index) => (
                    <Button
                      key={index}
                      className={`${
                        priceRange.min === range.min.toString() &&
                        priceRange.max === range.max.toString()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      } text-xs md:text-sm py-2 h-auto shadow-sm rounded-lg`}
                      onClick={() =>
                        handlePriceRangeSelect(range.min, range.max)
                      }
                    >
                      <span className="truncate">{range.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Brand carousel */}
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Popular Brands
                    </h3>
                    <div className="flex items-center gap-1 md:hidden">
                      <button
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        id="scroll-left"
                        aria-label="Scroll left"
                        onClick={() => {
                          const container =
                            document.getElementById("brands-container");
                          if (container) container.scrollLeft -= 200;
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        id="scroll-right"
                        aria-label="Scroll right"
                        onClick={() => {
                          const container =
                            document.getElementById("brands-container");
                          if (container) container.scrollLeft += 200;
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile scrollable container with custom scroll buttons */}
                  <div
                    id="brands-container"
                    className="flex md:grid md:grid-cols-8 gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x"
                  >
                    {popularBrands.map((brand, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 flex flex-col items-center justify-center transition-all snap-center ${
                          selectedFilters.brands.includes(brand.name)
                            ? "scale-105"
                            : ""
                        }`}
                        onClick={() => handleBrandSelect(brand.name)}
                        style={{ minWidth: "80px" }} // Ensures consistent width on mobile
                      >
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center   ${
                            selectedFilters.brands.includes(brand.name)
                              ? "border-blue-500 shadow-md "
                              : " hover:border-gray-300 hover:bg-gray-100"
                          } transition-all duration-200`}
                        >
                          <Image
                            src={brand.image}
                            alt={brand.displayName}
                            width={40}
                            height={40}
                            className="object-contain max-w-[70%] max-h-[70%]"
                            onError={(e) => {
                              // If image fails to load, show text fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
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
                        <p className="text-xs mt-2 text-center font-medium truncate w-full">
                          {brand.displayName}
                        </p>
                        {selectedFilters.brands.includes(brand.name) && (
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* View all brands button */}
                </div>

                {/* Results count - Mobile */}
                <div className="lg:hidden mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredCars.length} vehicles found
                  </h2>
                  <p className="text-xs text-gray-500">Based on your filters</p>
                </div>

                {/* Car listings */}
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {paginatedCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px] group"
                        onClick={() => navigateToCarDetail(car.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image section with improved visual treatment */}
                          <div className="md:w-2/5 h-64 md:h-auto relative cursor-pointer overflow-hidden">
                            <div className="w-full h-full bg-gray-100">
                              {car.images && car.images.length > 0 ? (
                                <Image
                                  src={car.images[0]}
                                  alt={car.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, 40vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                  <Car size={48} />
                                </div>
                              )}
                            </div>

                            {/* Enhanced badges */}
                            <div className="absolute top-0 left-0 p-3 flex flex-col gap-2">
                              {car.condition === "New" && (
                                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                  NEW
                                </div>
                              )}
                              {car.featured && (
                                <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                  FEATURED
                                </div>
                              )}
                            </div>

                            {/* Image count indicator */}
                            {car.images && car.images.length > 1 && (
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                <span className="flex items-center">
                                  <Camera size={12} className="mr-1" />
                                  {car.images.length} Photos
                                </span>
                              </div>
                            )}

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Content section with improved layout */}
                          <div className="p-5 md:p-6 md:w-3/5 flex flex-col justify-between relative">
                            {/* Top section with title, price and location */}
                            <div>
                              {/* Title and price */}
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 pr-4">
                                  {car.title}
                                </h3>
                                <div className="flex items-center">
                                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                                    {formatPrice(car.price)}
                                  </span>
                                  {car.msrp && car.msrp > car.price && (
                                    <span className="ml-2 text-sm line-through text-gray-400">
                                      {formatPrice(car.msrp)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Location with map pin */}
                              <div className="flex items-center text-sm text-gray-500 mb-4">
                                <MapPin
                                  size={14}
                                  className="mr-1 text-gray-400"
                                />
                                <span>{car.location}</span>
                                {car.distance && (
                                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                    {car.distance} miles away
                                  </span>
                                )}
                              </div>

                              {/* Key specifications in a visually appealing grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 shadow-sm">
                                    <Calendar
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                      Year
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {car.year}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 shadow-sm">
                                    <Gauge
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                      Mileage
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {formatNumber(car.mileage)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 shadow-sm">
                                    <Badge
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                      Condition
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {car.condition}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 shadow-sm">
                                    <Settings
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                      Transmission
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {car.transmission}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Additional highlights */}
                              {car.highlights && car.highlights.length > 0 && (
                                <div className="mb-5">
                                  <div className="flex flex-wrap gap-2">
                                    {car.highlights
                                      .slice(0, 3)
                                      .map((highlight, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200"
                                        >
                                          {highlight}
                                        </span>
                                      ))}
                                    {car.highlights.length > 3 && (
                                      <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                                        +{car.highlights.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                              <Link
                                href={`/car/${car.id}`}
                                className="flex-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center justify-center">
                                  View Details
                                  <ChevronRight size={16} className="ml-1" />
                                </Button>
                              </Link>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="px-4 py-2.5 border-gray-300 hover:bg-gray-50 rounded-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add save/favorite functionality
                                  }}
                                >
                                  <Heart size={18} className="text-gray-500" />
                                </Button>

                                <Button
                                  variant="outline"
                                  className="px-4 py-2.5 border-gray-300 hover:bg-gray-50 rounded-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add compare functionality
                                  }}
                                >
                                  <Scale size={18} className="text-gray-500" />
                                </Button>
                              </div>
                            </div>

                            {/* Special offers or financing options */}
                            {car.specialOffer && (
                              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 flex items-center">
                                <Tag size={16} className="mr-2 flex-shrink-0" />
                                <span>{car.specialOffer}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px] cursor-pointer group"
                        onClick={() => navigateToCarDetail(car.id)}
                      >
                        <div className="relative h-48 sm:h-44 lg:h-48">
                          {car.images && car.images.length > 0 ? (
                            <Image
                              src={car.images[0]}
                              alt={car.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <Car size={48} />
                            </div>
                          )}

                          {/* Condition badges */}
                          {car.condition === "New" && (
                            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                              NEW
                            </div>
                          )}

                          {/* Photo count indicator */}
                          {car.images && car.images.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                              <Camera size={12} className="mr-1" />
                              {car.images.length}
                            </div>
                          )}

                          {/* Price and location overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                            <span className="text-white text-lg font-bold">
                              {formatPrice(car.price)}
                            </span>
                            <div className="flex items-center text-xs text-white">
                              <MapPin size={12} className="mr-1" />
                              <span>{car.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {car.title}
                          </h3>

                          {/* Specs with proper icons */}
                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                            <div className="flex items-center">
                              <Calendar
                                size={16}
                                className="text-blue-600 mr-2 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {car.year}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Gauge
                                size={16}
                                className="text-blue-600 mr-2 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {formatNumber(car.mileage)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Badge
                                size={16}
                                className="text-blue-600 mr-2 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {car.condition}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Settings
                                size={16}
                                className="text-blue-600 mr-2 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {car.transmission}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <Link
                              href={`/car/${car.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1"
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm rounded-lg flex items-center justify-center">
                                View Details
                                <ChevronRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {filteredCars.length === 0 && !isLoading && (
                  <div className="text-center py-12 bg-white mt-6 border border-gray-200 rounded-xl shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                      <Search size={28} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No vehicles match your criteria
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Try adjusting your filters or browse all available
                      vehicles to find what you're looking for.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {filteredCars.length > itemsPerPage && (
                  <div className="mt-8 flex justify-center">
                    <nav
                      className="flex items-center gap-1 md:gap-2"
                      aria-label="Pagination"
                    >
                      {/* Previous page button */}
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0 flex items-center justify-center rounded-lg border-gray-300"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} />
                      </Button>

                      {/* Page numbers */}
                      {(() => {
                        const totalPages = Math.ceil(
                          filteredCars.length / itemsPerPage
                        );
                        let pageButtons = [];

                        if (totalPages <= 5) {
                          // Show all pages if 5 or fewer
                          for (let i = 1; i <= totalPages; i++) {
                            pageButtons.push(
                              <Button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={
                                  i === currentPage
                                    ? "bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                }
                                variant={
                                  i === currentPage ? "default" : "outline"
                                }
                                aria-current={
                                  i === currentPage ? "page" : undefined
                                }
                              >
                                {i}
                              </Button>
                            );
                          }
                        } else {
                          // Always show page 1
                          pageButtons.push(
                            <Button
                              key={1}
                              onClick={() => handlePageChange(1)}
                              className={
                                currentPage === 1
                                  ? "bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                              }
                              variant={
                                currentPage === 1 ? "default" : "outline"
                              }
                              aria-current={
                                currentPage === 1 ? "page" : undefined
                              }
                            >
                              1
                            </Button>
                          );

                          // Show ellipsis if current page is far from start
                          if (currentPage > 3) {
                            pageButtons.push(
                              <span
                                key="ellipsis1"
                                className="text-gray-500 px-2"
                                aria-hidden="true"
                              >
                                ...
                              </span>
                            );
                          }

                          // Show current page and neighbors
                          const startPage = Math.max(2, currentPage - 1);
                          const endPage = Math.min(
                            totalPages - 1,
                            currentPage + 1
                          );

                          for (let i = startPage; i <= endPage; i++) {
                            pageButtons.push(
                              <Button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={
                                  i === currentPage
                                    ? "bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                }
                                variant={
                                  i === currentPage ? "default" : "outline"
                                }
                                aria-current={
                                  i === currentPage ? "page" : undefined
                                }
                              >
                                {i}
                              </Button>
                            );
                          }

                          // Show ellipsis if current page is far from end
                          if (currentPage < totalPages - 2) {
                            pageButtons.push(
                              <span
                                key="ellipsis2"
                                className="text-gray-500 px-2"
                                aria-hidden="true"
                              >
                                ...
                              </span>
                            );
                          }

                          // Always show last page
                          if (totalPages > 1) {
                            pageButtons.push(
                              <Button
                                key={totalPages}
                                onClick={() => handlePageChange(totalPages)}
                                className={
                                  currentPage === totalPages
                                    ? "bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-10 h-10 p-0 flex items-center justify-center rounded-lg"
                                }
                                variant={
                                  currentPage === totalPages
                                    ? "default"
                                    : "outline"
                                }
                                aria-current={
                                  currentPage === totalPages
                                    ? "page"
                                    : undefined
                                }
                              >
                                {totalPages}
                              </Button>
                            );
                          }
                        }

                        return pageButtons;
                      })()}

                      {/* Next page button */}
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0 flex items-center justify-center rounded-lg border-gray-300"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredCars.length / itemsPerPage)
                        }
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
function page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}

export default page;
