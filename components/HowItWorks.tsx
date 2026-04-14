'use client';
import { useState } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Choose Date & Time",
      description: "Select your preferred date from the calendar and pick an available time slot that works for you.",
      icon: "📅",
      details: "Browse available slots from 6 AM to next day 6 AM"
    },
    {
      number: "02",
      title: "Select Duration",
      description: "Choose how many hours you want to book. Minimum 1 hour, maximum 24 hours.",
      icon: "⏱️",
      details: "Flexible hourly booking with special rates for longer sessions"
    },
    {
      number: "03",
      title: "Make Payment",
      description: "Pay securely through Paystack using cards, bank transfers, or mobile money.",
      icon: "💳",
      details: "100% secure payment with instant confirmation"
    },
    {
      number: "04",
      title: "Confirm & Play",
      description: "Get instant confirmation via email and SMS. Show up and enjoy your game!",
      icon: "🎮",
      details: "Free cancellation up to 2 hours before booking"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-blue-400 font-semibold text-sm">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works in
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 4 Easy Steps</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Get your arena booked in minutes with our streamlined process
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Step Number Background */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">
                {step.number}
              </div>
              
              {/* Card */}
              <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/20 ${activeStep === index ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                <div className="text-5xl mb-4 animate-bounce">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
                
                {/* Additional Details */}
                <div className={`mt-4 overflow-hidden transition-all duration-300 ${activeStep === index ? 'max-h-20' : 'max-h-0'}`}>
                  <p className="text-blue-400 text-xs">{step.details}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl transition transform hover:scale-105">
            Start Booking Now →
          </button>
        </div>
      </div>
    </section>
  );
}