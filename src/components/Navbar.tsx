"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Car,
  Search,
  User,
  Menu,
  X,
  CreditCard,
  Wrench,
  Phone,
  Info,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Set active tab based on current route
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (
      pathname.startsWith("/shop") ||
      pathname.startsWith("/inventory")
    ) {
      setActiveTab("shop");
    } else if (pathname.startsWith("/financing")) {
      setActiveTab("financing");
    } else if (pathname.startsWith("/services")) {
      setActiveTab("services");
    } else if (pathname.startsWith("/about")) {
      setActiveTab("about");
    } else if (pathname.startsWith("/contact")) {
      setActiveTab("contact");
    }
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);

      // Close search overlay
      setSearchOpen(false);

      // Reset search query after navigation
      setSearchQuery("");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle pressing Enter in search field
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 font-montserrat transition-all duration-300 ${
        scrolled ? "shadow-xl" : "shadow-lg"
      }`}
    >
      {/* Top Bar with Contact Info */}
      <div className="hidden md:block bg-gray-900 text-gray-200 py-2">
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center hover:text-white transition-colors">
              <Phone size={14} className="mr-1.5" />
              <span>+1(571) 775 1602</span>
            </span>
            {/* <span className="flex items-center hover:text-white transition-colors">
              <MapPin size={14} className="mr-1.5" />
              <span>123 Auto Drive, Cartown, CT 12345</span>
            </span> */}
            <span className="flex items-center hover:text-white transition-colors">
              <Clock size={14} className="mr-1.5" />
              <span>Mon-Sat: 9AM-8PM</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className={`bg-gradient-to-r from-blue-900 to-blue-800 text-white transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Main Navbar */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-none">
              <Link href="/" className="flex items-center">
                <Image
                  src="/Screenshot__357_-removebg-preview.png"
                  alt="Patriot Auto Sales Logo"
                  width={scrolled ? 120 : 150}
                  height={scrolled ? 40 : 50}
                  className="mr-2 transition-all duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Only visible on desktop */}
            <nav className="hidden lg:flex items-center space-x-8 ml-10">
              <Link
                href="/"
                className={`font-medium text-sm tracking-wide hover:text-blue-300 transition-colors py-2 border-b-2 ${
                  activeTab === "home"
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("home")}
              >
                HOME
              </Link>
              <Link
                href="/shop"
                className={`font-medium text-sm tracking-wide hover:text-blue-300 transition-colors py-2 border-b-2 ${
                  activeTab === "shop"
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("shop")}
              >
                INVENTORY
              </Link>

              <Link
                href="/services"
                className={`font-medium text-sm tracking-wide hover:text-blue-300 transition-colors py-2 border-b-2 ${
                  activeTab === "services"
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("services")}
              >
                SERVICES
              </Link>
              <Link
                href="/about"
                className={`font-medium text-sm tracking-wide hover:text-blue-300 transition-colors py-2 border-b-2 ${
                  activeTab === "about"
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("about")}
              >
                ABOUT US
              </Link>
              <Link
                href="/contact"
                className={`font-medium text-sm tracking-wide hover:text-blue-300 transition-colors py-2 border-b-2 ${
                  activeTab === "contact"
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("contact")}
              >
                CONTACT
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center ml-auto space-x-4">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search overlay with animation */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className="absolute inset-x-0 top-full bg-blue-800 p-4 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search for vehicles by make, model, or year..."
                    className="w-full p-3 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-6 rounded-r-md flex items-center justify-center transition-colors duration-200"
                  >
                    <Search size={20} />
                  </button>
                </form>
                <div className="flex justify-between items-center mt-3 text-sm text-blue-200">
                  <p>Press Enter to search</p>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile menu overlay - slides from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in menu */}
            <motion.div
              className="fixed top-0 text-white right-0 bottom-0 w-4/5 max-w-sm bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg z-50 lg:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center p-4 border-b border-blue-700">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile search */}
              <div className="p-4 border-b border-blue-700">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    className="w-full p-2 rounded-l-md text-gray-900 focus:outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-md flex items-center justify-center"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              <nav className="p-4 flex flex-col space-y-1">
                <Link
                  href="/"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "home"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("home");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <ShoppingBag size={18} className="mr-3" />
                    <span className="font-medium">Home</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/shop"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "shop"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("shop");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Car size={18} className="mr-3" />
                    <span className="font-medium">Inventory</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/shop/new"
                  className="flex items-center justify-between p-4 pl-10 rounded-md hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>New Vehicles</span>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/shop/used"
                  className="flex items-center justify-between p-4 pl-10 rounded-md hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Used Vehicles</span>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/shop/special-offers"
                  className="flex items-center justify-between p-4 pl-10 rounded-md hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Special Offers</span>
                  <ChevronRight size={18} />
                </Link>

                <div className="border-t border-blue-700 my-2"></div>

                <Link
                  href="/financing"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "financing"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("financing");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <CreditCard size={18} className="mr-3" />
                    <span className="font-medium">Financing</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/services"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "services"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("services");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Wrench size={18} className="mr-3" />
                    <span className="font-medium">Services</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "about"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("about");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Info size={18} className="mr-3" />
                    <span className="font-medium">About Us</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center justify-between p-4 rounded-md ${
                    activeTab === "contact"
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveTab("contact");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Phone size={18} className="mr-3" />
                    <span className="font-medium">Contact</span>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                <div className="border-t border-blue-700 my-2"></div>
              </nav>

              {/* Contact info in mobile menu */}
              <div className="p-6 mt-auto border-t border-blue-700">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center">
                    <Phone size={16} className="mr-3 text-blue-300" />
                    <span>+1(571) 775 1602</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-3 text-blue-300" />
                    <span>123 Auto Drive, Cartown, CT 12345</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-3 text-blue-300" />
                    <span>Mon-Sat: 9AM-8PM</span>
                  </div>
                </div>

                {/* Mobile social links */}
                <div className="flex items-center space-x-6 mt-6">
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
