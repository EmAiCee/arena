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
  const [debug, setDebug] = useState<string[]>([]);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  
  const { user, token } = useAuth();

  const addDebug = (message: string) => {
    console.log(message);
    setDebug(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebug('Page loaded');
    localStorage.removeItem('pendingPaymentRef');
    localStorage.removeItem('pendingBookingData');
  }, []);

  useEffect(() => {
    addDebug('Loading Paystack script...');
    if (typeof window !== 'undefined' && !window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        setPaystackLoaded(true);
        addDebug('✅ Paystack script loaded');
      };
      script.onerror = () => {
        addDebug('❌ Paystack script failed to load');
        setError('Payment system failed to load');
      };
      document.head.appendChild(script);
    } else if (window.PaystackPop) {
      setPaystackLoaded(true);
      addDebug('✅ Paystack already loaded');
    }
  }, []);

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
        militaryHour: hour
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
      availableEndTimes.push(timeSlots[i]);
    }
    return availableEndTimes;
  };

  const availableEndTimes = getAvailableEndTimes();

  const saveBooking = async (paymentReference: string) => {
    addDebug(`Saving booking with reference: ${paymentReference}`);
    
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
      addDebug(`API Response: ${response.status} - ${JSON.stringify(data)}`);
      
      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }
      
      addDebug('✅ Booking saved successfully!');
      alert(`✅ Booking Confirmed!\n\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${startTime} - ${endTime}\nAmount: ${formatNaira(totalPrice)}`);
      window.location.href = '/my-bookings';
      
    } catch (err: any) {
      addDebug(`❌ Save error: ${err.message}`);
      alert(`❌ Failed to save booking: ${err.message}`);
    }
  };

  // CORRECT PAYSTACK IMPLEMENTATION
  const payWithPaystack = () => {
    addDebug('Starting Paystack payment...');
    setIsLoading(true);
    
    const paymentReference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    addDebug(`Reference: ${paymentReference}`);
    
    const amountInKobo = totalPrice * 100;
    addDebug(`Amount: ₦${totalPrice} (${amountInKobo} kobo)`);
    
    // Initialize Paystack transaction
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amountInKobo,
      currency: 'NGN',
      ref: paymentReference,
      firstname: user.name?.split(' ')[0] || '',
      lastname: user.name?.split(' ')[1] || '',
      metadata: {
        custom_fields: [
          { display_name: "Booking Date", variable_name: "booking_date", value: selectedDate.toLocaleDateString() },
          { display_name: "Time Range", variable_name: "time_range", value: `${startTime} - ${endTime}` },
          { display_name: "Hours", variable_name: "hours", value: totalHours.toString() },
        ],
      },
      callback: (response: any) => {
        addDebug(`✅ Paystack callback received! Status: ${response.status}`);
        addDebug(`Response: ${JSON.stringify(response)}`);
        
        if (response.status === 'success') {
          addDebug('Payment successful! Saving booking...');
          setShowPayment(false);
          setIsLoading(false);
          saveBooking(paymentReference);
        } else {
          addDebug(`❌ Payment status: ${response.status}`);
          setError(`Payment ${response.status}`);
          setIsLoading(false);
        }
      },
      onClose: () => {
        addDebug('❌ Payment modal closed by user');
        setIsLoading(false);
        setShowPayment(false);
      },
    });
    
    handler.openIframe();
  };

  const handleProceedToPayment = () => {
    addDebug('Proceed to payment clicked');
    if (!selectedDate || !startTime || !endTime) {
      setError('Please select date and time');
      return;
    }
    if (!user) {
      setError('Please login to book');
      return;
    }
    if (!paystackLoaded) {
      setError('Payment system loading...');
      return;
    }
    setShowPayment(true);
  };

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

          {/* Debug Panel */}
          <div className="mb-4 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-xs max-h-48 overflow-y-auto">
            <p className="font-bold mb-1 text-white">Debug Log:</p>
            {debug.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Select Date</h2>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full p-3 border rounded-lg"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">⏰ Select Time Range</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2">Start Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setStartTime(slot.time);
                            setEndTime('');
                          }}
                          className={`p-2 rounded-lg text-sm transition ${
                            startTime === slot.time
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-blue-100'
                          }`}
                        >
                          {slot.time}
                          {slot.isNextDay && <span className="ml-1 text-xs">📅</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">End Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {availableEndTimes.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEndTime(slot.time)}
                          className={`p-2 rounded-lg text-sm transition ${
                            endTime === slot.time
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 hover:bg-green-100'
                          }`}
                        >
                          {slot.time}
                          {slot.isNextDay && <span className="ml-1 text-xs">📅</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {startTime && endTime && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="font-bold">{startTime} → {endTime}</p>
                    <p className="text-green-600 font-bold">{totalHours} hour(s)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                
                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-semibold">{startTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-semibold">{endTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-semibold text-green-600">{totalHours} hours</span>
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