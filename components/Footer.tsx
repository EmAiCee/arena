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
              Secondfate
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Premium arena booking platform for sports enthusiasts. Book, play, and enjoy the best experience!
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              {['FB', 'TW', 'IG', 'IN'].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 text-sm font-bold"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Book Arena', 'My Bookings', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition flex items-center space-x-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
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

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-3">
              Get latest offers and updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-lg hover:shadow-lg transition">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} SecondGate Arena. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white ml-2">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-white ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}