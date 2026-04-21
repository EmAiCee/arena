import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send booking confirmation to user
export async function sendBookingConfirmationToUser(
  userEmail: string,
  userName: string,
  booking: any
) {
  try {
    const date = new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(booking.totalAmount);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Booking Confirmed! 🎉</h2>
        <p>Hello ${userName},</p>
        <p>Your arena booking has been confirmed.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>⏰ Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
          <p><strong>⏱️ Duration:</strong> ${booking.hours} hours</p>
          <p><strong>💰 Amount:</strong> ${formattedAmount}</p>
          <p><strong>📋 Reference:</strong> ${booking.paymentReference}</p>
        </div>
        <p>Need help? Contact us at support@arenabook.com</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ArenaBook" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: `Booking Confirmed - ArenaBook (${date})`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Error sending user email:', error);
    return false;
  }
}

// Send notification to admin
export async function sendAdminNotification(booking: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'algonimusa202@gmail.com';
    const date = new Date(booking.date).toLocaleDateString();

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>🔔 New Booking Alert!</h2>
        <p><strong>Customer:</strong> ${booking.userName}</p>
        <p><strong>Email:</strong> ${booking.userEmail}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
        <p><strong>Amount:</strong> ₦${booking.totalAmount.toLocaleString()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ArenaBook" <${process.env.EMAIL_FROM}>`,
      to: adminEmail,
      subject: `🔔 New Booking - ${booking.userName}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Error sending admin email:', error);
    return false;
  }
}