import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingReminder } from '@/lib/email';

export async function GET() {
  try {
    await connectDB();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Find bookings for tomorrow that haven't had a reminder sent
    const bookings = await Booking.find({
      date: {
        $gte: tomorrow,
        $lt: nextDay,
      },
      status: 'confirmed',
      reminderSent: { $ne: true },
    });
    
    let sentCount = 0;
    for (const booking of bookings) {
      await sendBookingReminder(booking);
      await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
      sentCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} reminders`,
      sentCount,
    });
  } catch (error) {
    console.error('Reminder error:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}