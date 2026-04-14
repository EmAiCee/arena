import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Fetch bookings for this user, sorted by newest first
    const bookings = await Booking.find({ userId: decoded.userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings for user ${decoded.userId}`);
    
    return NextResponse.json({ 
      success: true, 
      bookings: bookings 
    });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}