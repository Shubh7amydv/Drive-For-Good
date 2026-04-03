require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  subscriptionMonthly: Number(process.env.SUBSCRIPTION_MONTHLY || 19),
  subscriptionYearly: Number(process.env.SUBSCRIPTION_YEARLY || 190),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  razorpayMonthlyPlanId: process.env.RAZORPAY_MONTHLY_PLAN_ID || "",
  razorpayYearlyPlanId: process.env.RAZORPAY_YEARLY_PLAN_ID || "",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || ""
};
