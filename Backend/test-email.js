require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testEmail() {
  try {
    console.log("Testing email connection...");
    console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
    console.log(`SMTP User: ${process.env.SMTP_USER}`);

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: "Drive For Good - Email Configuration Test",
      html: `
        <h2>✅ Email Configuration Successful</h2>
        <p>This is a test email from Drive For Good.</p>
        <p>If you received this, your SMTP configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: "Test email from Drive For Good"
    });

    console.log("✅ Email sent successfully!");
    console.log(`Message ID: ${info.messageId}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to send email:");
    console.error(error.message);
    process.exit(1);
  }
}

testEmail();
