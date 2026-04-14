import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
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

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Recent bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}