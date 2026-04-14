import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get full user details from database to get phone number
    const user = await User.findById(decoded.userId);
    
    const { date, startTime, endTime, hours, totalAmount, paymentReference } = await request.json();
    
    // Create booking with user's phone number
    const booking = await Booking.create({
      userId: decoded.userId,
      userName: user?.name || decoded.name || 'User',
      userEmail: decoded.email,
      userPhone: user?.phone || '', // Get phone from user document
      date: new Date(date),
      startTime,
      endTime,
      hours,
      totalAmount,
      paymentReference,
      status: 'confirmed',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}