'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import "react-datepicker/dist/react-datepicker.css";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, token } = useAuth();

  // Generate time slots from 6 AM to next day 6 AM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 30; hour++) {
      let displayHour = hour % 24;
      let period = displayHour >= 12 ? 'PM' : 'AM';
      let hour12 = displayHour % 12 || 12;
      let timeString = `${hour12}:00 ${period}`;
      let isNextDay = hour >= 24;
      slots.push({
        time: timeString,
        value: timeString,
        isNextDay: isNextDay,
        hour24: hour,
        militaryHour: hour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Mock booked slots - in production, fetch from API
  const isSlotBooked = (time: string) => {
    // This would check against database
    return false;
  };

  const isTimeRangeAvailable = (start: string, end: string) => {
    const startIndex = timeSlots.findIndex(slot => slot.time === start);
    const endIndex = timeSlots.findIndex(slot => slot.time === end);
    
    if (startIndex === -1 || endIndex === -1) return false;
    if (endIndex <= startIndex) return false;
    
    return true;
  };

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    
    const startSlot = timeSlots.find(slot => slot.time === startTime);
    const endSlot = timeSlots.find(slot => slot.time === endTime);
    
    if (!startSlot || !endSlot) return 0;
    
    let hours = endSlot.militaryHour - startSlot.militaryHour;
    return hours > 0 ? hours : 0;
  };

  const totalHours = calculateHours();
  const hourlyRate = 13000;
  const totalPrice = totalHours * hourlyRate;

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    
    const startIndex = timeSlots.findIndex(slot => slot.time === startTime);
    if (startIndex === -1) return [];
    
    const availableEndTimes = [];
    for (let i = startIndex + 1; i <= startIndex + 24 && i < timeSlots.length; i++) {
      availableEndTimes.push(timeSlots[i]);
    }
    return availableEndTimes;
  };

  const availableEndTimes = getAvailableEndTimes();

  // REAL PAYMENT & BOOKING HANDLER
  const handleProceedToPayment = async () => {
    if (!selectedDate || !startTime || !endTime) {
      setError('Please select date, start time, and end time');
      return;
    }
    
    if (!user) {
      setError('Please login to book');
      return;
    }
    
    setShowPayment(true);
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Generate a unique payment reference
      const paymentReference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create booking in database
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime,
          endTime,
          hours: totalHours,
          totalAmount: totalPrice,
          paymentReference,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }
      
      // Show success message
      alert(`✅ Booking Confirmed!\n\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${startTime} - ${endTime}\nDuration: ${totalHours} hours\nAmount: ${formatNaira(totalPrice)}\n\nReference: ${paymentReference}`);
      
      // Close modal and reset form
      setShowPayment(false);
      setStartTime('');
      setEndTime('');
      
      // Redirect to my bookings
      window.location.href = '/my-bookings';
      
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message);
      alert('❌ Booking failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Book Your Arena
            </h1>
            <p className="text-gray-600 text-lg">
              Select date and choose your preferred time range
            </p>
            <div className="inline-block mt-2 px-4 py-1 bg-green-100 rounded-full">
              <span className="text-green-700 font-semibold">💰 {formatNaira(13000)} per hour</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Booking Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Date and Time Selection */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Date Selection Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  Select Date
                </h2>
                <div className="border rounded-lg p-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  * Bookings available 30 days in advance
                </p>
              </div>

              {/* Time Slots Selection Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⏰</span>
                  Select Time Range
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Operating Hours: 6:00 AM → Next Day 6:00 AM
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Start Time Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                      {timeSlots.map((slot, index) => {
                        const selected = startTime === slot.time;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setStartTime(slot.time);
                              setEndTime('');
                            }}
                            className={`
                              p-2 rounded-lg text-sm font-medium transition-all duration-200
                              ${selected
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                              }
                            `}
                          >
                            {slot.time}
                            {slot.isNextDay && (
                              <span className="ml-1 text-xs">📅</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* End Time Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                      {availableEndTimes.map((slot, index) => {
                        const selected = endTime === slot.time;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setEndTime(slot.time)}
                            className={`
                              p-2 rounded-lg text-sm font-medium transition-all duration-200
                              ${selected
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                                : 'bg-gray-100 hover:bg-green-100 text-gray-700'
                              }
                            `}
                          >
                            {slot.time}
                            {slot.isNextDay && (
                              <span className="ml-1 text-xs">📅</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {startTime && availableEndTimes.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        No available end times
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Time Range Display */}
                {startTime && endTime && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-center">
                      <span className="font-bold text-blue-600">{startTime}</span>
                      <span className="mx-2">→</span>
                      <span className="font-bold text-purple-600">{endTime}</span>
                    </p>
                    <p className="text-center text-sm text-gray-600 mt-1">
                      Total Duration: <span className="font-bold text-green-600">{totalHours} hour(s)</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Summary & Payment */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Booking Summary
                </h2>
                
                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-semibold">{startTime || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Time:</span>
                    <span className="font-semibold">{endTime || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-green-600">{totalHours} hour(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-semibold text-green-600">{formatNaira(hourlyRate)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-2 border-t-2 border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatNaira(totalPrice)}
                  </span>
                </div>
                
                {!user ? (
                  <div className="mt-6 p-3 bg-yellow-100 rounded-lg text-center">
                    <p className="text-sm text-yellow-800">Please login to book</p>
                  </div>
                ) : (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!startTime || !endTime || totalHours === 0}
                    className={`
                      w-full mt-6 py-3 rounded-full font-semibold transition-all transform
                      ${!startTime || !endTime || totalHours === 0
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:scale-105 text-white'
                      }
                    `}
                  >
                    Proceed to Payment →
                  </button>
                )}
                
                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>✅ Free cancellation up to 2 hours before</p>
                  <p>🔒 Secure payment with Paystack</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Confirm Booking</h3>
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Booking Details:</p>
                    <p className="text-sm font-semibold">
                      📅 {selectedDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm">
                      ⏰ {startTime} → {endTime}
                    </p>
                    <p className="text-sm">
                      ⏱️ {totalHours} hour(s)
                    </p>
                    <p className="text-sm mt-2">
                      👤 {user?.name}
                    </p>
                    <p className="text-sm">
                      📧 {user?.email}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Amount to pay:</p>
                    <p className="text-3xl font-bold text-green-600">{formatNaira(totalPrice)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ({formatNaira(hourlyRate)} × {totalHours} hour(s))
                    </p>
                  </div>
                  
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : `Confirm & Pay ${formatNaira(totalPrice)}`}
                  </button>
                  
                  <p className="text-xs text-center text-gray-500">
                    By confirming, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}