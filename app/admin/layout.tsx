'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Define admin emails - ONLY these emails can access admin panel
const ADMIN_EMAILS = ['algonimusa202@gmail.com']; // Add your email here

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;
    
    // Check if user is logged in
    if (!user) {
      console.log('No user, redirecting to home');
      router.push('/');
      return;
    }
    
    // Check if user email is in admin list
    const isAdmin = ADMIN_EMAILS.includes(user.email);
    console.log('User email:', user.email);
    console.log('Is admin:', isAdmin);
    
    if (!isAdmin) {
      console.log('Not admin, redirecting to home');
      router.push('/');
      return;
    }
    
    // User is admin
    setIsAuthorized(true);
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-xl font-bold">
                🏢 Admin Dashboard
              </Link>
              <div className="hidden md:flex space-x-4 ml-8">
                <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
                <Link href="/admin/bookings" className="hover:text-gray-300">Bookings</Link>
                <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
                <Link href="/admin/reports" className="hover:text-gray-300">Reports</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <span className="text-xs bg-green-600 px-2 py-1 rounded">Admin</span>
              <Link href="/" className="text-sm hover:text-gray-300">View Site</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}