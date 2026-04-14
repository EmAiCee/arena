'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg backdrop-blur-md' 
        : 'bg-white/95 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform transition group-hover:scale-110 shadow-md">
              {/* <span className="text-white font-bold text-xl">A</span> */}
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SecondGate Arena
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Home
            </Link>
            <Link 
              href="/book" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Book Arena
            </Link>
            <Link 
              href="/my-bookings" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              My Bookings
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition">
              Login
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition transform hover:scale-105">
              Sign Up Free
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200 mt-2 animate-fade-in-up bg-white">
            <Link 
              href="/" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/book" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Arena
            </Link>
            <Link 
              href="/my-bookings" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 space-y-2">
              <button className="w-full text-left text-blue-600 font-medium py-2">
                Login
              </button>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium">
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}