'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import "react-datepicker/dist/react-datepicker.css";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  const { user, token } = useAuth();

  // Load Paystack script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        setPaystackLoaded(true);
        console.log('Paystack script loaded');
      };
      script.onerror = () => {
        setError('Payment system failed to load. Please refresh the page.');
      };
      document.head.appendChild(script);
    } else if (window.PaystackPop) {
      setPaystackLoaded(true);
    }
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    setLoadingAvailability(true);
    try {
      const response = await fetch('/api/bookings/available-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      const data = await response.json();
      
      // Extract all booked time slots
      const booked: string[] = [];
      data.bookings?.forEach((booking: any) => {
        const startHour = convertTimeToHour(booking.startTime);
        const endHour = convertTimeToHour(booking.endTime);
        for (let hour = startHour; hour < endHour; hour++) {
          booked.push(convertHourToTime(hour));
        }
      });
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Helper functions for time conversion
  const convertTimeToHour = (time: string): number => {
    const [timeStr, period] = time.split(' ');
    let [hour] = timeStr.split(':').map(Number);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const convertHourToTime = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour}:00 ${period}`;
  };

  // Check if a specific time slot is booked
  const isSlotBooked = (time: string) => {
    return bookedSlots.includes(time);
  };

  // Check if the selected time range is fully available
  const isTimeRangeAvailable = (start: string, end: string) => {
    if (!start || !end) return true;
    
    const startHour = convertTimeToHour(start);
    const endHour = convertTimeToHour(end);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const currentSlot = convertHourToTime(hour);
      if (isSlotBooked(currentSlot)) {
        return false;
      }
    }
    return true;
  };

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
        isNextDay: isNextDay,
        militaryHour: hour,
        isBooked: isSlotBooked(timeString)
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
      const slot = timeSlots[i];
      // Check if the entire range from start to this slot is available
      let rangeAvailable = true;
      for (let j = startIndex; j <= i; j++) {
        if (timeSlots[j].isBooked) {
          rangeAvailable = false;
          break;
        }
      }
      if (rangeAvailable) {
        availableEndTimes.push(slot);
      } else {
        break; // Stop at first booked slot
      }
    }
    return availableEndTimes;
  };

  const availableEndTimes = getAvailableEndTimes();

  const saveBooking = async (paymentReference: string) => {
    // Final availability check before saving
    if (!isTimeRangeAvailable(startTime, endTime)) {
      alert('Sorry, this time slot was just booked by someone else. Please select another time.');
      fetchBookedSlots();
      setStartTime('');
      setEndTime('');
      setShowPayment(false);
      return;
    }
    
    try {
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
          paymentStatus: 'confirmed',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }
      
      alert(`✅ Booking Confirmed!\n\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${startTime} - ${endTime}\nAmount: ${formatNaira(totalPrice)}`);
      window.location.href = '/my-bookings';
      
    } catch (err: any) {
      console.error('Save booking error:', err);
      alert(`❌ Failed to save booking: ${err.message}`);
    }
  };

  const payWithPaystack = () => {
    // Check availability before payment
    if (!isTimeRangeAvailable(startTime, endTime)) {
      setError('Sorry, this time slot is no longer available. Please select another time.');
      fetchBookedSlots();
      setStartTime('');
      setEndTime('');
      setShowPayment(false);
      return;
    }
    
    setIsLoading(true);
    
    const paymentReference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: totalPrice * 100,
      currency: 'NGN',
      ref: paymentReference,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: user.name },
          { display_name: "Booking Date", variable_name: "booking_date", value: selectedDate.toLocaleDateString() },
          { display_name: "Time Range", variable_name: "time_range", value: `${startTime} - ${endTime}` },
          { display_name: "Hours", variable_name: "hours", value: totalHours.toString() },
        ],
      },
      callback: (response: any) => {
        if (response.status === 'success') {
          setShowPayment(false);
          saveBooking(paymentReference);
        } else {
          setError(`Payment ${response.status}`);
        }
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
        setShowPayment(false);
      },
    });
    
    handler.openIframe();
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !startTime || !endTime) {
      setError('Please select date and time');
      return;
    }
    
    // Check availability before showing payment modal
    if (!isTimeRangeAvailable(startTime, endTime)) {
      setError('Sorry, this time slot is no longer available. Please select another time.');
      fetchBookedSlots();
      setStartTime('');
      setEndTime('');
      return;
    }
    
    if (!user) {
      setError('Please login to book');
      return;
    }
    
    if (!paystackLoaded) {
      setError('Payment system loading. Please wait...');
      return;
    }
    
    setShowPayment(true);
  };

  // Update time slots when bookedSlots changes
  useEffect(() => {
    // This will re-render the time slots when bookedSlots updates
  }, [bookedSlots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
              <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
            </div>
          )}

          {loadingAvailability && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
              Loading available time slots...
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Date Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Select Date</h2>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => {
                    setSelectedDate(date);
                    setStartTime('');
                    setEndTime('');
                  }}
                  minDate={new Date()}
                  className="w-full p-3 border rounded-lg"
                  dateFormat="MMMM d, yyyy"
                />
                <p className="text-sm text-gray-500 mt-2">
                  * Green slots are available, Red slots are booked
                </p>
              </div>

              {/* Time Slots Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">⏰ Select Time Range</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Start Time Selection */}
                  <div>
                    <label className="block font-semibold mb-2">Start Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((slot, idx) => {
                        const isBooked = slot.isBooked;
                        const isSelected = startTime === slot.time;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!isBooked) {
                                setStartTime(slot.time);
                                setEndTime('');
                              }
                            }}
                            disabled={isBooked}
                            className={`p-2 rounded-lg text-sm transition ${
                              isBooked 
                                ? 'bg-red-200 text-red-600 line-through cursor-not-allowed'
                                : isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-green-100 hover:bg-green-200 text-gray-700'
                            }`}
                          >
                            {slot.time}
                            {slot.isNextDay && !isBooked && <span className="ml-1 text-xs">📅</span>}
                            {isBooked && <span className="block text-xs">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* End Time Selection */}
                  <div>
                    <label className="block font-semibold mb-2">End Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {availableEndTimes.map((slot, idx) => {
                        const isSelected = endTime === slot.time;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setEndTime(slot.time)}
                            className={`p-2 rounded-lg text-sm transition ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 hover:bg-purple-100 text-gray-700'
                            }`}
                          >
                            {slot.time}
                            {slot.isNextDay && <span className="ml-1 text-xs">📅</span>}
                          </button>
                        );
                      })}
                    </div>
                    {startTime && availableEndTimes.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        No available end times. The time slot may be already booked.
                      </p>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded mr-1"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 rounded mr-1"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded mr-1"></div>
                    <span>Selected Start</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded mr-1"></div>
                    <span>Selected End</span>
                  </div>
                </div>

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

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                
                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start:</span>
                    <span className="font-semibold">{startTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End:</span>
                    <span className="font-semibold">{endTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-green-600">{totalHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-semibold">{formatNaira(hourlyRate)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">{formatNaira(totalPrice)}</span>
                </div>
                
                {!user ? (
                  <div className="mt-6 p-3 bg-yellow-100 rounded-lg text-center">
                    Please login to book
                  </div>
                ) : (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!startTime || !endTime || totalHours === 0}
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-300"
                  >
                    Proceed to Payment →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Complete Payment</h3>
                  <button onClick={() => setShowPayment(false)} className="text-gray-500 text-2xl">×</button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p><strong>📅 Date:</strong> {selectedDate.toLocaleDateString()}</p>
                  <p><strong>⏰ Time:</strong> {startTime} → {endTime}</p>
                  <p><strong>⏱️ Duration:</strong> {totalHours} hour(s)</p>
                  <p className="mt-2"><strong>👤 Name:</strong> {user?.name}</p>
                  <p><strong>📧 Email:</strong> {user?.email}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{formatNaira(totalPrice)}</p>
                  <p className="text-xs">({formatNaira(hourlyRate)} × {totalHours} hour(s))</p>
                </div>
                
                <button
                  onClick={payWithPaystack}
                  disabled={isLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : `Pay ${formatNaira(totalPrice)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}