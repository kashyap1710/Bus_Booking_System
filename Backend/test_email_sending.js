import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendTestEmail() {
  console.log("📧 Testing Email Configuration...");
  console.log(`   User: ${process.env.EMAIL_USER}`);
  // Don't log the password, just check if it exists
  console.log(`   Pass: ${process.env.EMAIL_PASS ? "****" : "MISSING"}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env file");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use the authenticated user as sender to avoid spam blocks
      to: process.env.EMAIL_USER,   // Send to self for testing
      subject: "Test Email from Sleeper Bus App",
      text: "If you see this, your email configuration is working correctly! 🚀",
    });

    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:");
    console.error(error);
  }
}

sendTestEmail();
