import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  Shield,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Navigation links to match navbar
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/shop" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 mt-auto relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-900/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-12 border-b border-gray-800/50">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              {/* Logo with minimal styling */}
              <Image
                src="/Screenshot__357_-removebg-preview.png"
                alt="Patriot Auto Sales Logo"
                width={160}
                height={40}
                className="mr-3"
              />
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Your trusted platform for buying quality vehicles. Connecting
              buyers and sellers nationwide since 2016.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <h4 className="text-lg font-medium mb-3">
              Subscribe to our newsletter
            </h4>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col space-y-2"
            >
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 text-white w-full md:w-64 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium rounded-r-md transition-colors flex items-center ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                  {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-400 text-sm">
                  Thank you for subscribing to our newsletter!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Content - Three column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-gray-800/50">
              Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight
                      size={16}
                      className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-gray-800/50">
              Contact Information
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@patriotautosales.com"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={18} className="mr-3 text-red-500" />
                  <span>info@patriotautosales.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours & Phone Numbers */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-gray-800/50">
              Business Hours & Contact
            </h3>
            <ul className="space-y-4">
              {/* <li>
                <a
                  href="tel:+15717751602"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={18} className="mr-3 text-blue-500" />
                  <span>+15717751602</span>
                </a>
              </li> */}
              <li>
                <a
                  href="tel:+15717751602"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={18} className="mr-3 text-blue-500" />
                  <span>+1(571) 775 1602</span>
                </a>
              </li>
              <li className="flex items-start pt-4">
                <Clock
                  size={18}
                  className="mr-3 text-blue-500 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Mon-Fri</p>
                  <p className="text-gray-400">9AM - 8PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock
                  size={18}
                  className="mr-3 text-blue-500 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Sat</p>
                  <p className="text-gray-400">10AM - 6PM</p>
                </div>
              </li>
              {/* <li className="flex items-start pt-4">
                <MapPin
                  size={18}
                  className="mr-3 text-blue-500 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Headquarters</p>
                  <p className="text-gray-400">OKLAHOMA, USA</p>
                </div>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Section with Payment Methods and Copyright */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                © 2025 Patriot Auto Sales. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
