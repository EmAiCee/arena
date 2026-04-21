import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendBookingConfirmationToUser, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  console.log('=== CREATE BOOKING API CALLED ===');
  
  try {
    // Get token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log('✅ Token verified:', decoded);
    } catch (err) {
      console.log('❌ Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Connect to DB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');
    
    // Get user
    const user = await User.findById(decoded.userId);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get request body
    const { date, startTime, endTime, hours, totalAmount, paymentReference, paymentStatus } = await request.json();
    console.log('Request body:', { date, startTime, endTime, hours, totalAmount, paymentReference, paymentStatus });
    
    // Check for existing booking
    const existingBooking = await Booking.findOne({ paymentReference });
    if (existingBooking) {
      console.log('⚠️ Booking already exists:', paymentReference);
      return NextResponse.json({ 
        error: 'Booking already exists', 
        booking: existingBooking 
      }, { status: 409 });
    }
    
    // Create booking
    const booking = await Booking.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone || '',
      date: new Date(date),
      startTime,
      endTime,
      hours,
      totalAmount,
      paymentReference,
      status: paymentStatus === 'confirmed' ? 'confirmed' : 'pending',
    });
    
    console.log('✅ Booking created successfully:', booking._id);
    
    // 📧 SEND EMAIL NOTIFICATIONS
    console.log('📧 Sending email notifications...');
    try {
      // Send to user
      await sendBookingConfirmationToUser(user.email, user.name, booking);
      console.log('✅ User email sent to:', user.email);
      
      // Send to admin
      await sendAdminNotification(booking);
      console.log('✅ Admin email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      // Don't fail the booking if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
    
  } catch (error: any) {
    console.error('❌ Booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}