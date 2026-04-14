import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const ADMIN_EMAILS = ['algonimusa202@gmail.com'];

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (!ADMIN_EMAILS.includes(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { bookingId, status } = await request.json();
    
    await connectDB();
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}