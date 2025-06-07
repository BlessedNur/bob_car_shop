"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Car,
  CreditCard,
  Shield,
  Clock,
  FileText,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// FAQ item type
type FAQItem = {
  question: string;
  answer: string;
  icon: React.ReactNode;
};

// FAQ sections
const faqSections = [
  {
    title: "General Questions",
    icon: <HelpCircle className="h-6 w-6" />,
    items: [
      {
        question:
          "What makes Patriot Auto Sales different from other dealerships?",
        answer:
          "At Patriot Auto Sales, we pride ourselves on our transparent pricing, extensive vehicle history reports, and commitment to customer satisfaction. We offer a 7-day return policy, 90-day warranty, and thorough vehicle inspections to ensure you get the best value for your money.",
        icon: <Sparkles className="h-5 w-5" />,
      },

      {
        question: "What is your return policy?",
        answer:
          "We offer a 7-day return policy on all our vehicles. If you're not completely satisfied with your purchase, you can return the vehicle within 7 days for a full refund, no questions asked.",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Financing & Payment",
    icon: <CreditCard className="h-6 w-6" />,
    items: [
      {
        question: "What financing options do you offer?",
        answer:
          "We offer various financing options including traditional auto loans, lease options, and in-house financing. Our finance team will work with you to find the best option that fits your budget and needs.",
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        question: "What documents do I need for financing?",
        answer:
          "You'll need a valid driver's license, proof of income, proof of residence, and insurance information. Additional documents may be required based on your specific situation.",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        question: "Do you accept trade-ins?",
        answer:
          "Yes, we accept trade-ins! We'll evaluate your current vehicle and offer you a fair market value. The trade-in value can be applied towards your new vehicle purchase.",
        icon: <Car className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Vehicle Information",
    icon: <Car className="h-6 w-6" />,
    items: [
      {
        question: "Do you provide vehicle history reports?",
        answer:
          "Yes, we provide detailed vehicle history reports for all our vehicles. These reports include information about previous owners, accident history, maintenance records, and more.",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        question: "What warranty do you offer?",
        answer:
          "We offer a 90-day warranty on all our vehicles. This covers major mechanical components and provides peace of mind with your purchase.",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        question: "How do you ensure vehicle quality?",
        answer:
          "All our vehicles undergo a thorough 150-point inspection before being listed for sale. We only sell vehicles that meet our high quality standards.",
        icon: <Sparkles className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Customer Service",
    icon: <MessageCircle className="h-6 w-6" />,
    items: [
      {
        question: "How can I contact customer service?",
        answer:
          "You can reach our customer service team through multiple channels: phone, email, or live chat on our website. We aim to respond to all inquiries within 24 hours.",
        icon: <MessageCircle className="h-5 w-5" />,
      },
      {
        question: "What are your business hours?",
        answer:
          "We're open Monday through Saturday from 9 AM to 8 PM, and Sunday from 10 AM to 6 PM. Our service department is available during these hours as well.",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        question: "Do you offer after-sales support?",
        answer:
          "Yes, we provide comprehensive after-sales support including maintenance reminders, service scheduling, and assistance with any questions or concerns you may have.",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
];

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
                <HelpCircle size={16} className="mr-2" />
                <span>Frequently Asked Questions</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How Can We Help You?
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Find answers to common questions about our vehicles, services,
                and policies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-blue-600">{section.icon}</div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => {
                    const key = `${sectionIndex}-${itemIndex}`;
                    const isExpanded = expandedItems[key];

                    return (
                      <div
                        key={key}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(sectionIndex, itemIndex)}
                          className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-blue-600 mt-1">
                              {item.icon}
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.question}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-gray-600 pl-8">{item.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team is here to help. Contact us directly and we'll get back
              to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                  <MessageCircle size={20} className="mr-2" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-white text-black hover:bg-white/10 hover:text-white px-8 py-6 text-lg"
                >
                  Browse Inventory
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
