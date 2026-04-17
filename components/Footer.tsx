import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Border Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ArenaBook
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Premium arena booking platform for sports enthusiasts. Book, play, and enjoy the best experience!
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 text-sm font-bold"
              >
                FB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 text-sm font-bold"
              >
                TW
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 text-sm font-bold"
              >
                IG
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 text-sm font-bold"
              >
                IN
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition flex items-center space-x-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-400 hover:text-white transition flex items-center space-x-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                  <span>Book Arena</span>
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-gray-400 hover:text-white transition flex items-center space-x-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                  <span>My Bookings</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition flex items-center space-x-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition flex items-center space-x-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Opening Hours</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-sm text-gray-400">Monday - Sunday</div>
                <div className="font-semibold">6:00 AM → Next Day 6:00 AM</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30">
                <div className="text-sm text-blue-400">24/7 Online Booking</div>
                <div className="font-semibold">Book Anytime, Anywhere</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-gray-400">📍</span>
                <span className="text-gray-400 text-sm">Second Gate opp antenna, suleja, Niger state</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">📞</span>
                <a href="tel:+2349012345678" className="text-gray-400 hover:text-white text-sm transition">
                  +234 901 489 9278
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">✉️</span>
                <a href="mailto:info@arenabook.com" className="text-gray-400 hover:text-white text-sm transition">
                 algonimusa202@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ArenaBook. All rights reserved. | 
            <Link href="/privacy-policy" className="hover:text-white ml-2 transition">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-white ml-2 transition">Terms of Service</Link> | 
            <Link href="/refund-policy" className="hover:text-white ml-2 transition">Refund Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}