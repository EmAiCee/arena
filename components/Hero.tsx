'use client';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div 
        className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ left: '10%', top: '20%' }}
      ></div>
      <div 
        className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ right: '10%', bottom: '20%', animationDelay: '2s' }}
      ></div>
      
      {/* Interactive Mouse Follower */}
      <div 
        className="hidden md:block absolute w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-3xl opacity-20 transition-all duration-300"
        style={{ 
          left: mousePosition.x - 128, 
          top: mousePosition.y - 128 
        }}
      ></div>

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center min-h-screen text-white text-center px-4">
        <div className="animate-fade-in-up">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            {/* <span className="text-sm">⚡ Limited Time Offer - 20% Off First Booking</span> */}
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            Book Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Session Now</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Premium sports facility available 24/7. Book by the hour, play anytime, anywhere.
          </p>

          {/* CTA Buttons - Only Book Now */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/book"
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl transition transform hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <span>Book Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto">
            {[
              { value: '24/7', label: 'Hour Availability' },
              { value: '100+', label: 'Happy Customers' },
              { value: '₦13k', label: 'Per Hour' }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}