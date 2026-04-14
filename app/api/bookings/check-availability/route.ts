import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { date, startTime, endTime } = await request.json();
    
    // Find all confirmed bookings for the date
    const bookings = await Booking.find({
      date: new Date(date),
      status: 'confirmed',
    });
    
    // Check if the requested time range overlaps with any existing booking
    const isAvailable = !bookings.some((booking) => {
      // Convert times to comparable format
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      
      // Check for overlap
      return (startTime >= bookingStart && startTime < bookingEnd) ||
             (endTime > bookingStart && endTime <= bookingEnd) ||
             (startTime <= bookingStart && endTime >= bookingEnd);
    });
    
    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}