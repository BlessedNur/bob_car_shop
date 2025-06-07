"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Car,
  Wrench,
  DollarSign,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Star,
  Heart,
  Award,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Phone,
  MapPin,
  Zap,
  Layers,
  Gauge,
  DollarSign as DollarSignIcon,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const services = [
    {
      title: "Vehicle Sales",
      description:
        "Browse our extensive inventory of quality pre-owned vehicles. We offer competitive pricing and flexible financing options to make your dream car a reality.",
      icon: Car,
      features: [
        "Wide selection of pre-owned vehicles",
        "Competitive pricing",
        "Flexible financing options",
        "Trade-in services",
        "Vehicle history reports",
        "150-point inspection",
        "Test drive availability",
      ],
      image:
        "https://images.pexels.com/photos/11435082/pexels-photo-11435082.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Auto Repair & Maintenance",
      description:
        "Keep your vehicle running smoothly with our comprehensive maintenance and repair services. Our certified technicians use state-of-the-art equipment to ensure quality service.",
      icon: Wrench,
      features: [
        "Regular maintenance",
        "Engine diagnostics",
        "Brake service",
        "Oil changes",
        "Tire rotation and alignment",
        "AC service",
        "Electrical repairs",
      ],
      image:
        "https://images.pexels.com/photos/29028107/pexels-photo-29028107/free-photo-of-sleek-white-toyota-sports-car-in-front-of-dealership.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Financing Solutions",
      description:
        "We work with multiple lenders to provide you with the best financing options. Our team will help you find a payment plan that fits your budget.",
      icon: DollarSign,
      features: [
        "Competitive interest rates",
        "Flexible terms",
        "Quick approval process",
        "Bad credit options",
        "First-time buyer programs",
        "Trade-in value maximization",
        "Extended warranty options",
      ],
      image:
        "https://images.pexels.com/photos/18434047/pexels-photo-18434047/free-photo-of-a-red-car-with-a-steering-wheel.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Extended Warranty",
      description:
        "Protect your investment with our comprehensive extended warranty options. Choose from various coverage plans to suit your needs and budget.",
      icon: Shield,
      features: [
        "Comprehensive coverage",
        "Transferable warranties",
        "Nationwide service network",
        "24/7 roadside assistance",
        "Flexible payment options",
        "Zero deductible options",
        "Rental car coverage",
      ],
      image:
        "https://images.pexels.com/photos/9301036/pexels-photo-9301036.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: "from-amber-500 to-amber-700",
    },
  ];

  const guarantees = [
    {
      title: "Expert Service",
      description:
        "Our team of certified technicians has years of experience in the automotive industry.",
      icon: Users,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Quick Turnaround",
      description:
        "We value your time and work efficiently to get you back on the road as soon as possible.",
      icon: Clock,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Quality Guarantee",
      description:
        "We stand behind our work with a satisfaction guarantee on all services.",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section with parallax effect */}
        <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.pexels.com/photos/29115175/pexels-photo-29115175/free-photo-of-striking-orange-mclaren-supercar-at-illinois-airport.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Patriot Auto Sales Services"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70" />
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <Sparkles size={16} className="mr-2" />
                <span>Our Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Comprehensive Automotive Solutions
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                From sales to service, we provide everything you need for your
                automotive journey.
              </p>
            </motion.div>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center text-sm mt-8 text-blue-200">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={16} className="mx-2" />
              <span className="font-medium text-white">Services</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-70 blur-3xl"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-70 blur-3xl"
          ></motion.div>

          <div className="container mx-auto px-4 max-w-7xl relative">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                  <Star size={16} className="mr-2" />
                  <span>What We Offer</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our <span className="text-blue-600">Services</span>
                </h2>

                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Discover our comprehensive range of automotive services
                  designed to meet all your needs.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-16">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className={`lg:order-${index % 2 === 0 ? "1" : "2"}`}>
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}
                        >
                          {React.createElement(service.icon, {
                            className: "h-8 w-8 text-white",
                          })}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        <ul className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center text-gray-600"
                            >
                              <CheckCircle
                                size={18}
                                className="text-green-500 mr-3 flex-shrink-0"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Image */}
                    <div className={`lg:order-${index % 2 === 0 ? "2" : "1"}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative rounded-2xl overflow-hidden shadow-xl"
                      >
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_50%)]"></div>

          <div className="container mx-auto px-4 max-w-7xl relative">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                  <Heart size={16} className="mr-2" />
                  <span>Why Choose Us</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  The Patriot Auto Sales{" "}
                  <span className="text-blue-600">Difference</span>
                </h2>

                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  We're committed to providing exceptional service and value to
                  our customers. Here's what sets us apart:
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guarantees.map((item, index) => (
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
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}
                    >
                      {React.createElement(item.icon, {
                        className: "h-8 w-8 text-white",
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  5,000+
                </div>
                <div className="text-gray-600">Vehicles Sold</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  4,500+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">13+</div>
                <div className="text-gray-600">Years Experience</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/29115175/pexels-photo-29115175/free-photo-of-striking-orange-mclaren-supercar-at-illinois-airport.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience the Patriot Difference?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Whether you're looking to buy a new vehicle or need
                  maintenance services, our team is here to help. Contact us
                  today to learn more about our services.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="bg-white hover:bg-gray-100 text-blue-600 py-6 px-8 rounded-xl text-lg"
                    onClick={() => (window.location.href = "/contact")}
                  >
                    Contact Us
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10 py-6 px-8 rounded-xl text-lg"
                    onClick={() => (window.location.href = "/shop")}
                  >
                    View Inventory
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
