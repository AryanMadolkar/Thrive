import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(60),
  bio: z.string().max(280).optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
});

export const journeySchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  category: z.enum([
    "FITNESS",
    "LEARNING",
    "CAREER",
    "TRAVEL",
    "CREATIVITY",
    "PERSONAL_GROWTH",
    "LIFESTYLE",
    "BUILDING",
    "OTHER",
  ]),
  description: z.string().max(2000).optional().or(z.literal("")),
  goal: z.string().max(500).optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  targetDate: z.string().optional().or(z.literal("")),
  visibility: z.enum(["PUBLIC", "FOLLOWERS", "PRIVATE"]),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "DRAFT"]).optional(),
});

export const updateSchema = z.object({
  content: z.string().min(1, "Write something").max(5000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isMilestone: z.boolean().optional(),
  journeyId: z.string().min(1),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  updateId: z.string().min(1),
  parentId: z.string().optional(),
});

export const reportSchema = z.object({
  reason: z.enum(["SPAM", "HARASSMENT", "INAPPROPRIATE", "OTHER"]),
  details: z.string().max(500).optional(),
  targetType: z.enum(["journey", "update", "comment", "user"]),
  targetId: z.string().min(1),
});
