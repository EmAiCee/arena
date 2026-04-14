import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { date } = await request.json();
    
    // Get all confirmed bookings for the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookings = await Booking.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['confirmed', 'pending'] } // Only show booked slots for confirmed/pending
    });
    
    // Extract all booked time slots
    const bookedSlots: { startTime: string; endTime: string }[] = [];
    
    bookings.forEach(booking => {
      // Get all time slots between start and end time
      const startHour = convertTimeToHour(booking.startTime);
      const endHour = convertTimeToHour(booking.endTime);
      
      for (let hour = startHour; hour < endHour; hour++) {
        bookedSlots.push({
          startTime: convertHourToTime(hour),
          endTime: convertHourToTime(hour + 1)
        });
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      bookedSlots,
      bookings: bookings.map(b => ({
        startTime: b.startTime,
        endTime: b.endTime,
        hours: b.hours
      }))
    });
    
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}

// Helper functions
function convertTimeToHour(time: string): number {
  const [timeStr, period] = time.split(' ');
  let [hour] = timeStr.split(':').map(Number);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour;
}

function convertHourToTime(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  return `${displayHour}:00 ${period}`;
}