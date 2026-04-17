'use client';
import { useState } from 'react';

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: "⏰",
      title: "Hourly Booking",
      description: "Book by the hour - from 1 to 24 hours. Pay only for what you use.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive rates with special discounts for longer bookings.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "✅",
      title: "Easy Booking",
      description: "Simple 3-step process: Select time, pay, and play!",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "100% secure payments with Paystack integration.",
      color: "from-red-500 to-orange-500"
    },
    // {
    //   icon: "🔄",
    //   title: "Free Cancellation",
    //   description: "Cancel up to 2 hours before for full refund.",
    //   color: "from-yellow-500 to-amber-500"
    // },
    {
      icon: "🏆",
      title: "Premium Facility",
      description: "Professional-grade arena with top-notch equipment.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-600 font-semibold text-sm">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Premium Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Football Lovers</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the best booking platform with amazing features designed for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 transform transition group-hover:scale-110 group-hover:rotate-6`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* Learn More Link */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                <span className="text-blue-600 text-sm font-semibold inline-flex items-center">
                  Learn More 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}