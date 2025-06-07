"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const vehicleName = searchParams.get("vehicle") || "Selected Vehicle";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formState.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
            ...formState,
            vehicleName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Success
      setSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferredContact: "email",
      });

      // Scroll to top of form
      window.scrollTo({
        top: document.getElementById("order-form")?.offsetTop || 0,
        behavior: "smooth",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        form: "There was an error submitting your inquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="mx-auto max-w-[2000px]">
          {/* Hero section */}
          <div className="bg-blue-900 text-white py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Order Inquiry
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
                  Interested in {vehicleName}? Fill out the form below and we'll
                  get back to you shortly.
                </p>

                {/* Breadcrumb */}
                <div className="flex items-center text-sm mt-8 text-blue-200">
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                  <ChevronRight size={16} className="mx-2" />
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors"
                  >
                    Shop
                  </Link>
                  <ChevronRight size={16} className="mx-2" />
                  <span className="font-medium text-white">Order Inquiry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Order form */}
                <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                  <div id="order-form">
                    <h2 className="text-2xl font-bold mb-2">
                      Send Your Inquiry
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Fill out the form below and we'll get back to you as soon
                      as possible about {vehicleName}.
                    </p>

                    {/* Success message */}
                    {submitted && (
                      <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                        <CheckCircle
                          className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Inquiry sent successfully!
                          </h4>
                          <p className="text-green-700 text-sm">
                            Thank you for your interest. We'll respond to your
                            inquiry shortly.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {errors.form && (
                      <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-red-700">{errors.form}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Name field */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formState.name}
                            onChange={handleChange}
                            className={errors.name ? "border-red-300" : ""}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email field */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formState.email}
                            onChange={handleChange}
                            className={errors.email ? "border-red-300" : ""}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone field */}
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+15717751602"
                            value={formState.phone}
                            onChange={handleChange}
                            className={errors.phone ? "border-red-300" : ""}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Preferred contact method */}
                        <div>
                          <label
                            htmlFor="preferredContact"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Preferred Contact Method
                          </label>
                          <Select
                            value={formState.preferredContact}
                            onValueChange={(value) =>
                              handleSelectChange("preferredContact", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred contact method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="text">Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Message field */}
                      <div className="mb-6">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="I'm interested in this vehicle..."
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          className={errors.message ? "border-red-300" : ""}
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit button */}
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Inquiry"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-2">
                  {/* Business hours */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <Clock className="mr-2 text-blue-600" size={20} />
                      Business Hours
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 8:00 PM</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-medium">10:00 AM - 6:00 PM</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-medium">Closed</span>
                      </li>
                    </ul>
                  </div>

                  {/* Call to action */}
                  <div className="bg-blue-600 p-6 rounded-xl text-white">
                    <h3 className="font-semibold text-xl mb-3">
                      Need Immediate Assistance?
                    </h3>
                    <p className="text-blue-100 mb-4">
                      Our team is ready to help with any urgent questions about
                      this vehicle.
                    </p>
                    <div className="space-y-4">
                      <Button
                        className="w-full bg-white hover:bg-gray-100 text-blue-600 flex items-center justify-center"
                        onClick={() =>
                          (window.location.href = "tel:+15717751602")
                        }
                      >
                        <Phone size={18} className="mr-2" />
                        Call Us Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
