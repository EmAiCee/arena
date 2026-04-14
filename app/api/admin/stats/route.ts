import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const ADMIN_EMAILS = ['algonimusa202@gmail.com']; // Add your email

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (!ADMIN_EMAILS.includes(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ status: 'completed' }),
    ]);

    // Monthly revenue for chart
    const monthlyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      monthlyRevenue: monthlyRevenue.map(m => ({ month: getMonthName(m._id), amount: m.total })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

function getMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
}