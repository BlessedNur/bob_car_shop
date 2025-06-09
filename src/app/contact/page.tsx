"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Calendar,
  Users,
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
import { Checkbox } from "@/components/ui/checkbox";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ContactPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
    subscribe: false,
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

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }));
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

    if (!formState.subject.trim()) {
      newErrors.subject = "Subject is required";
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
          type: "contact",
          formData: formState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Success
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email",
        subscribe: false,
      });

      // Scroll to top of form
      window.scrollTo({
        top: document.getElementById("contact-form")?.offsetTop || 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send your message. Please try again.");
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
                  Contact Us
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
                  Have questions about a vehicle or need assistance? Our team is
                  here to help you.
                </p>

                {/* Breadcrumb */}
                <div className="flex items-center text-sm mt-8 text-blue-200">
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                  <ChevronRight size={16} className="mx-2" />
                  <span className="font-medium text-white">Contact Us</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact information cards */}
          <div className="container mx-auto px-4 max-w-5xl -mt-8 md:-mt-12 mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone card */}
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className="text-gray-500 mb-4">
                  Our team is available Monday to Saturday
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-blue-600 font-semibold text-lg hover:underline"
                >
                  +1(571) 775 1602
                </a>
              </div>

              {/* Email card */}
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-500 mb-4">
                  We'll respond to your inquiry promptly
                </p>
                <a
                  href="mailto:contact@patriotautossales.com"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  contact@patriotautossales.com
                </a>
              </div>

              {/* Visit card */}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact form */}
                <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                  <div id="contact-form">
                    <h2 className="text-2xl font-bold mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>

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

                        {/* Subject field */}
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="Vehicle Inquiry"
                            value={formState.subject}
                            onChange={handleChange}
                            className={errors.subject ? "border-red-300" : ""}
                          />
                          {errors.subject && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.subject}
                            </p>
                          )}
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
                          placeholder="I'm interested in a vehicle on your website..."
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

                      {/* Preferred contact method */}
                      <div className="mb-6">
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

                      {/* Newsletter subscription */}
                      <div className="flex items-start mb-8">
                        <Checkbox
                          id="subscribe"
                          checked={formState.subscribe}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "subscribe",
                              checked as boolean
                            )
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="subscribe"
                          className="ml-2 text-sm text-gray-600"
                        >
                          Subscribe to our newsletter for exclusive offers, new
                          arrivals, and automotive tips.
                        </label>
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
                          "Send Message"
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
                      our vehicles.
                    </p>
                    <div className="space-y-4">
                      <Button
                        className="w-full bg-white hover:bg-gray-100 text-blue-600 flex items-center justify-center"
                        onClick={() =>
                          (window.location.href = "tel:+15551234567")
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

          {/* Map Section */}
          {/* <div className="bg-gray-100 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Us</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Visit our dealership to explore our extensive inventory of
                  quality vehicles and meet our friendly team.
                </p>
              </div>

              <div className="h-96 w-full bg-gray-200 relative">
             
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.39395492357392!3d34.0522342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b99c4a6f17a9%3A0x9e0c197ced5b98!2sLos%20Angeles%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1686517076212!5m2!1sen!2sus"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div> */}

          {/* FAQ Section */}
          <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about our services, financing
                  options, and more.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">
                    What financing options do you offer?
                  </h3>
                  <p className="text-gray-600">
                    We offer a variety of financing options to suit different
                    budgets and credit situations. Our finance team works with
                    multiple lenders to get you the best rates possible.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">
                    Do you accept trade-ins?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we accept trade-ins of all makes and models. Our team
                    will provide a fair market value for your current vehicle
                    that can be applied toward your new purchase.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">
                    What documents do I need to purchase a vehicle?
                  </h3>
                  <p className="text-gray-600">
                    You'll need a valid driver's license, proof of insurance,
                    and proof of income. If financing, additional documents may
                    be required based on the lender's requirements.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">
                    Do you offer vehicle delivery?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer vehicle delivery within a 100-mile radius of
                    our dealership. Contact our sales team for more information
                    about delivery options and fees.
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/faq">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    View All FAQs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
}
