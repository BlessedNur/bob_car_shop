"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Users,
  Award,
  Star,
  Car,
  Heart,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="mx-auto max-w-[2000px]">
          {/* Hero section with parallax effect */}
          <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.pexels.com/photos/29115175/pexels-photo-29115175/free-photo-of-striking-orange-mclaren-supercar-at-illinois-airport.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Patriot Auto Sales Dealership"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70" />
            </div>
            <div className="relative z-10 text-center text-white px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  About Patriot Auto Sales
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Your trusted partner in finding the perfect vehicle since
                  2010. We're committed to excellence, integrity, and customer
                  satisfaction.
                </p>
              </motion.div>

              {/* Breadcrumb */}
              <div className="flex items-center justify-center text-sm mt-8 text-blue-200">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span className="font-medium text-white">About Us</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white py-16">
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
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    13+
                  </div>
                  <div className="text-gray-600">Years Experience</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    98%
                  </div>
                  <div className="text-gray-600">Customer Satisfaction</div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative"
                >
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.pexels.com/photos/9702328/pexels-photo-9702328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Patriot Auto Sales Showroom"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Award className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          13+
                        </div>
                        <div className="text-gray-600">Years of Excellence</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                    <Star size={16} className="mr-2" />
                    <span>Our Story</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Building Trust Through Excellence
                  </h2>

                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Founded in 2010, Patriot Auto Sales has grown from a small
                    family-owned dealership to one of the most trusted names in
                    the automotive industry. Our journey has been built on the
                    foundation of honesty, transparency, and an unwavering
                    commitment to customer satisfaction.
                  </p>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Today, we continue to serve our community with the same
                    dedication and passion that we started with, offering a
                    carefully curated selection of quality vehicles and
                    exceptional service.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Car className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          5,000+
                        </div>
                        <div className="text-gray-600">Vehicles Sold</div>
                      </div>
                    </div>

                    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          4,500+
                        </div>
                        <div className="text-gray-600">Happy Customers</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                    <Heart size={16} className="mr-2" />
                    <span>Our Values</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    What Sets Us Apart
                  </h2>

                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Our core values guide everything we do, from selecting our
                    inventory to serving our customers.
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                    <Shield className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Integrity
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe in complete transparency in all our dealings,
                    ensuring our customers make informed decisions with
                    confidence.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                    <Award className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Excellence
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We strive for excellence in every aspect of our business,
                    from vehicle selection to customer service.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                    <Users className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Community
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're proud to be part of our local community and actively
                    contribute to its growth and well-being.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                    <CheckCircle size={16} className="mr-2" />
                    <span>Why Choose Us</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Experience the Patriot Difference
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start bg-white p-6 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                        <CheckCircle className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Quality Assured
                        </h3>
                        <p className="text-gray-600">
                          Every vehicle undergoes a rigorous 150-point
                          inspection before being offered for sale.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-white p-6 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                        <DollarSign className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Transparent Pricing
                        </h3>
                        <p className="text-gray-600">
                          No hidden fees or surprises. We believe in clear,
                          upfront pricing for all our vehicles.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-white p-6 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                        <TrendingUp className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Expert Financing
                        </h3>
                        <p className="text-gray-600">
                          Our finance team works with multiple lenders to find
                          the best rates for your situation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-white p-6 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                        <ThumbsUp className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Lifetime Support
                        </h3>
                        <p className="text-gray-600">
                          Our relationship doesn't end at the sale. We're here
                          for you throughout your ownership journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative"
                >
                  <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.pexels.com/photos/29115175/pexels-photo-29115175/free-photo-of-striking-orange-mclaren-supercar-at-illinois-airport.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Patriot Auto Sales Showroom"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ThumbsUp className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          98%
                        </div>
                        <div className="text-gray-600">
                          Customer Satisfaction
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/29115175/pexels-photo-29115175/free-photo-of-striking-orange-mclaren-supercar-at-illinois-airport.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10" />
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Experience the Patriot Difference?
                  </h2>
                  <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                    Visit our showroom today and discover why we're the
                    preferred choice for car buyers in our community.
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
