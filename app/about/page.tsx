'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ArenaBook</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Your trusted platform for booking premium sports arenas
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To make arena booking simple, accessible, and hassle-free for everyone. 
              We connect sports enthusiasts with premium facilities, allowing you to 
              book by the hour and play on your schedule.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">✨</div>
              <h2 className="text-2xl font-bold text-gray-800">What We Offer</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "⏰", text: "Hourly booking from 6 AM to next day 6 AM" },
                { icon: "💰", text: "Affordable rates at ₦13,000 per hour" },
                { icon: "🔒", text: "Secure payments via Paystack" },
                { icon: "✅", text: "Instant confirmation and easy management" },
                { icon: "🔄", text: "Free cancellation up to 2 hours before" },
                { icon: "🏆", text: "Premium quality sports facilities" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⭐</div>
              <h2 className="text-2xl font-bold text-gray-800">Why Choose Us</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Easy 3-step booking process</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Real-time availability checking</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">24/7 customer support</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">No hidden fees or charges</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Instant email confirmation</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Availability</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">₦13k</div>
              <div className="text-sm opacity-90">Per Hour</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm opacity-90">Rating</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to Play?</h2>
            <p className="mb-4 opacity-90">Book your arena today and experience the difference</p>
            <Link
              href="/book"
              className="inline-block px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              Book Now →
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}