'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  monthlyRevenue: { month: string; amount: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/recent-bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();

      setStats(statsData);
      setRecentBookings(bookingsData.bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your arena today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalBookings || 0}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatNaira(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Confirmed Bookings</p>
              <p className="text-3xl font-bold text-green-600">{stats?.confirmedBookings || 0}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <p className="text-yellow-800 font-semibold">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <p className="text-red-800 font-semibold">Cancelled</p>
          <p className="text-2xl font-bold text-red-800">{stats?.cancelledBookings || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-800 font-semibold">Completed</p>
          <p className="text-2xl font-bold text-blue-800">{stats?.completedBookings || 0}</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking: any) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{booking.userName}</div>
                    <div className="text-sm text-gray-500">{booking.userEmail}</div>
                  </td>
                  <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{booking.startTime} - {booking.endTime}</td>
                  <td className="px-6 py-4 font-semibold">{formatNaira(booking.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
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