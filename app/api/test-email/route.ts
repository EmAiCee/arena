import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationToUser } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    const testBooking = {
      date: new Date(),
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      hours: 3,
      totalAmount: 39000,
      paymentReference: 'TEST_12345',
    };
    
    await sendBookingConfirmationToUser(email, name, testBooking);
    
    return NextResponse.json({ message: 'Test email sent successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}