import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { bookingId } = await request.json();
    
    const booking = await Booking.findOne({ _id: bookingId, userId: decoded.userId });
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (bookingDate < today && booking.status === 'confirmed') {
      booking.status = 'completed';
      await booking.save();
      return NextResponse.json({ success: true, status: 'completed' });
    }
    
    return NextResponse.json({ success: false, message: 'Booking not yet due' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete booking' }, { status: 500 });
  }
}