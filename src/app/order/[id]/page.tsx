"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  MessageCircle,
  Phone,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Car,
  User,
  Mail,
  Home,
  FileText,
  CreditCard,
  CarFront,
  Settings,
  Sparkles,
  Star,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define car type
type Car = {
  id: string | number;
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

export default function OrderPage({ params }: { params: { id: string } }) {
  // State for car data
  const [carDetails, setCarDetails] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "", // Added address field
    message: "",
    preferredContact: "email",
    agreeToTerms: false,
    requestTestDrive: false,
    requestInspection: false,
    requestFinancing: false,
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        // Fetch car details from API
        const response = await fetch(`/api/cars/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }

        const data = await response.json();
        setCarDetails(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoadingError("Failed to load car details. Please try again later.");

        // Fallback to mock data if API fails
        // This is just for demo purposes
        const mockCarDetails: Car = {
          id: params.id,
          title: "Volkswagen Jetta 2007 Gold",
          price: 12500,
          currency: "$",
          location: "San Francisco, CA",
          condition: "Used",
          transmission: "Manual",
          year: 2007,
          make: "Volkswagen",
          model: "Jetta",
          color: "Gold",
          engineSize: "2000",
          fuelType: "Petrol",
          mileage: 42300,
          images: ["/cars/volkswagen-jetta-gold.jpg"],
          description:
            "Well maintained Volkswagen Jetta in excellent condition.",
          createdAt: new Date().toISOString(),
          sellerInfo: {
            name: "AutoWorld Dealer",
            verified: true,
            memberSince: "2019",
            responseRate: "95%",
            responseTime: "Within 2 hours",
            phone: "+15717751602",
            location: "San Francisco, CA",
          },
        };

        setCarDetails(mockCarDetails);
        toast.error("Using demo data - couldn't connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  // Format price with currency
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

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.preferredContact === "phone" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required for phone contact preference";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "order",
            formData: {
              ...formData,
              vehicleName: `${carDetails!.year} ${carDetails!.make} ${
                carDetails!.model
              }`,
              vehicleId: params.id,
              vehiclePrice: formatPrice(
                carDetails!.price,
                carDetails!.currency || "$"
              ),
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setIsSubmitted(true);
        toast.success("Your inquiry has been sent successfully!");

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
          preferredContact: "email",
          agreeToTerms: false,
          requestTestDrive: false,
          requestInspection: false,
          requestFinancing: false,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to send your inquiry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
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

  // If error or no car details, show error message
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

  // At this point, we know carDetails is not null
  const car = carDetails as NonNullable<typeof carDetails>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 to-blue-900 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="container mx-auto px-4 max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <Sparkles size={16} className="mr-2" />
                <span>Inquiry Form</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact Seller
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Fill out the form below to get in touch with the seller about
                this vehicle.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Car Details */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="relative h-64 md:h-80">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={car.images[0]}
                      alt={car.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Car size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {car.title}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Year</span>
                      </div>
                      <div className="font-semibold">{car.year}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Gauge size={16} />
                        <span className="text-sm">Mileage</span>
                      </div>
                      <div className="font-semibold">
                        {formatNumber(car.mileage)} mi
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <CarFront size={16} />
                        <span className="text-sm">Transmission</span>
                      </div>
                      <div className="font-semibold">{car.transmission}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Fuel size={16} />
                        <span className="text-sm">Fuel Type</span>
                      </div>
                      <div className="font-semibold">{car.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.price, car.currency || "$")}
                    </div>
                    <Link href={`/car/${car.id}`}>
                      <Button variant="outline" className="gap-2">
                        View Details
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.name ? "border-red-500" : ""
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.email ? "border-red-500" : ""
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.phone ? "border-red-500" : ""
                          }`}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Home size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Your address"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText size={16} className="text-gray-400" />
                      </div>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`pl-10 min-h-[120px] ${
                          formErrors.message ? "border-red-500" : ""
                        }`}
                        placeholder="Tell us what you're interested in..."
                      />
                    </div>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="requestFinancing"
                        checked={formData.requestFinancing}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "requestFinancing",
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor="requestFinancing"
                        className="text-sm text-gray-600"
                      >
                        I would like information about financing options
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "agreeToTerms",
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm text-gray-600"
                      >
                        I agree to the terms and conditions
                      </label>
                    </div>
                    {formErrors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={20} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* Right Column - Seller Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Shield size={20} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Seller Information
                  </h2>
                </div>

                {car.sellerInfo && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-semibold">
                        {car.sellerInfo.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {car.sellerInfo.name}
                          </h3>
                          {car.sellerInfo.verified && (
                            <Shield size={16} className="text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Member since {car.sellerInfo.memberSince}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={16} />
                        <span>
                          Response time: {car.sellerInfo.responseTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin size={16} />
                        <span>{car.sellerInfo.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Star size={16} className="text-yellow-400" />
                        <span>Seller Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          4.9
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <ThumbsUp size={20} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Why Choose Us
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Verified Listings
                      </h3>
                      <p className="text-sm text-gray-600">
                        All our vehicles are thoroughly inspected and verified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Secure Transactions
                      </h3>
                      <p className="text-sm text-gray-600">
                        Your information is always protected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Quick Response
                      </h3>
                      <p className="text-sm text-gray-600">
                        We respond to all inquiries within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
