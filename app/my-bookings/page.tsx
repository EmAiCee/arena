'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyBookings() {
  // Format currency in Naira
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock bookings data with NGN pricing
  const [bookings] = useState([
    {
      id: 1,
      date: '2024-01-20',
      time: '2:00 PM',
      hours: 2,
      totalAmount: 26000, // 2 hours × 13,000
      status: 'confirmed',
      arena: 'Main Arena'
    },
    {
      id: 2,
      date: '2024-01-25',
      time: '6:00 PM',
      hours: 3,
      totalAmount: 39000, // 3 hours × 13,000
      status: 'pending',
      arena: 'Premium Court'
    },
    {
      id: 3,
      date: '2024-01-10',
      time: '10:00 AM',
      hours: 1,
      totalAmount: 13000, // 1 hour × 13,000
      status: 'completed',
      arena: 'Main Arena'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              View and manage your arena bookings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            {['Upcoming', 'Past', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                className="px-6 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{booking.arena}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">📅 Date:</span>
                        <span className="ml-2 font-semibold">{booking.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">⏰ Time:</span>
                        <span className="ml-2 font-semibold">{booking.time}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">⏱️ Duration:</span>
                        <span className="ml-2 font-semibold">{booking.hours} hour(s)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">💰 Amount:</span>
                        <span className="ml-2 font-semibold text-green-600">{formatNaira(booking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition">
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                          Reschedule
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                        Book Again
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-4">Start your first booking now!</p>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                Book an Arena
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}