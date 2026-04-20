import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const ADMIN_EMAILS = ['algonimusa202@gmail.com'];

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
    
    const users = await User.find().sort({ createdAt: -1 });
    
    // Get booking count for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ userId: user._id });
        return { 
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          createdAt: user.createdAt,
          bookingCount 
        };
      })
    );

    return NextResponse.json({ users: usersWithCounts });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}