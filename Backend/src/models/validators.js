const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  charityId: z.string().optional(),
  charityPercent: z.number().min(10).max(100).default(10)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const subscriptionSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
  charityPercent: z.number().min(10).max(100).optional()
});

const scoreSchema = z.object({
  value: z.number().int().min(1).max(45),
  date: z.string().min(8)
});

module.exports = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  scoreSchema
};
