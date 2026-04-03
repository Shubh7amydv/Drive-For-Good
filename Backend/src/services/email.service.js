const nodemailer = require("nodemailer");
const {
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  mailFrom
} = require("../config/env");

function isEmailConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPass);
}

function getTransporter() {
  if (!isEmailConfigured()) {
    console.warn("Email is not configured. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    return { success: false, reason: "Email not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: mailFrom || smtpUser,
      to,
      subject,
      text,
      html
    });

    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Drive For Good",
    html: `
      <h2>Welcome, ${user.name}!</h2>
      <p>You've successfully registered for Drive For Good.</p>
      <p>Next steps:</p>
      <ol>
        <li>Choose your charity partner</li>
        <li>Start tracking your Stableford scores</li>
        <li>Activate your subscription</li>
        <li>Enter monthly draws and compete for prizes</li>
      </ol>
      <p>Good luck! 🏌️</p>
    `,
    text: `Welcome to Drive For Good, ${user.name}! Visit the platform to get started.`
  });
}

async function sendSubscriptionConfirmation(user, plan) {
  const amount = plan === "monthly" ? 19 : 190;
  const period = plan === "monthly" ? "monthly" : "yearly";

  return sendEmail({
    to: user.email,
    subject: "Subscription Activated",
    html: `
      <h2>Subscription Confirmed ✅</h2>
      <p>Hello ${user.name},</p>
      <p>Your ${period} subscription has been activated.</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>Next Billing:</strong> Your account will be renewed on the same date next ${period === "monthly" ? "month" : "year"}.</p>
      <p>You are now eligible for monthly draws and contributing to your chosen charity!</p>
      <p>Thank you for supporting Drive For Good! 🎉</p>
    `,
    text: `Your ${period} subscription is now active. You will be charged $${amount} and are eligible for monthly draws.`
  });
}

async function sendDrawResultsEmail(user, drawResults) {
  return sendEmail({
    to: user.email,
    subject: "Monthly Draw Results - Drive For Good",
    html: `
      <h2>Monthly Draw Results 🎰</h2>
      <p>Hello ${user.name},</p>
      <p>This month's draw has been completed!</p>
      <p><strong>Draw Numbers:</strong> ${drawResults.drawSet.join(", ")}</p>
      <p><strong>Your Scores:</strong> ${drawResults.userScores.join(", ")}</p>
      <p><strong>Your Match:</strong> ${drawResults.matchCount} numbers 🎯</p>
      ${drawResults.matchCount >= 3 ? `<p style="color: green;"><strong>🎉 Congratulations! You're a winner! Check your dashboard for next steps.</strong></p>` : `<p>Better luck next month!</p>`}
      <p>Thank you for playing.</p>
    `,
    text: `Monthly draw results: You matched ${drawResults.matchCount} numbers. Prize: ${drawResults.matchCount >= 3 ? "YES - Check your dashboard!" : "None this month."}`
  });
}

async function sendWinnerNotificationEmail(user, winner) {
  return sendEmail({
    to: user.email,
    subject: "🏆 You Won! Prize Claim Instructions",
    html: `
      <h2>Congratulations! You Won! 🏆</h2>
      <p>Hello ${user.name},</p>
      <p>You matched <strong>${winner.matchType} numbers</strong> in this month's draw!</p>
      <p><strong>Prize Amount:</strong> $${winner.amount.toFixed(2)}</p>
      <p><strong>Next Step:</strong> Upload proof of your scores in your Dashboard under "Winnings".</p>
      <p>Our team will review and approve within 48 hours. Approved winnings are paid within 5 business days.</p>
      <p>Claim your prize now:</p>
      <a href="https://yourdomain.com/dashboard" style="background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
      <p>Thank you for supporting Drive For Good!</p>
    `,
    text: `You won $${winner.amount}! Upload proof of scores in your dashboard to claim.`
  });
}

async function sendPayoutEmail(user, winner) {
  return sendEmail({
    to: user.email,
    subject: "💰 Your Winnings Have Been Paid!",
    html: `
      <h2>Payment Confirmed ✅</h2>
      <p>Hello ${user.name},</p>
      <p>Your prize of <strong>$${winner.amount.toFixed(2)}</strong> has been paid to your registered bank account.</p>
      <p><strong>Transaction Status:</strong> Completed</p>
      <p>Thank you for playing and supporting Drive For Good!</p>
      <p>See you in next month's draw!</p>
    `,
    text: `Your prize of $${winner.amount} has been paid. Check your bank account.`
  });
}

module.exports = {
  isEmailConfigured,
  sendEmail,
  sendWelcomeEmail,
  sendSubscriptionConfirmation,
  sendDrawResultsEmail,
  sendWinnerNotificationEmail,
  sendPayoutEmail
};
