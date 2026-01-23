import nodemailer from "nodemailer";

/**
 * Send Booking Confirmation Email
 * Uses Ethereal Email for testing (no real emails sent to user, but preview link provided)
 */
export async function sendBookingConfirmation(toEmail, bookingDetails) {
  try {
    // 1. Create Transporter (Using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Compose Email
    const info = await transporter.sendMail({
      from: `"Sleeper Bus Co." <${process.env.EMAIL_USER}>`, // Use authenticated email
      to: toEmail,
      subject: `Booking Confirmed! ID: ${bookingDetails.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">Booking Confirmation</h2>
          <p>Dear Customer,</p>
          <p>Your ticket has been successfully booked!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px;"><strong>Booking ID:</strong></td>
              <td style="padding: 10px;">${bookingDetails.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Journey Date:</strong></td>
              <td style="padding: 10px;">${bookingDetails.journeyDate}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px;"><strong>Seat Numbers:</strong></td>
              <td style="padding: 10px;">${bookingDetails.seats.join(", ")}</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Total Amount:</strong></td>
              <td style="padding: 10px;">₹${bookingDetails.totalAmount}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Thank you for choosing us!</p>
        </div>
      `,
    });

    console.log("---------------------------------------");
    console.log(`📧 Real Email sent successfully to ${toEmail}!`);
    console.log("---------------------------------------");

  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}
