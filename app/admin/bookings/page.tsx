'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/all-bookings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/update-booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status }),
      });
      
      if (response.ok) {
        fetchBookings(); // Refresh list
        alert(`Booking ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all arena bookings</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking: any) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{booking.userName}</div>
                    <div className="text-sm text-gray-500">{booking.userEmail}</div>
                  </td>
                  <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{booking.startTime} - {booking.endTime}</td>
                  <td className="px-6 py-4">{booking.hours} hr(s)</td>
                  <td className="px-6 py-4 font-semibold">{formatNaira(booking.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}