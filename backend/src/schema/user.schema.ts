import { z } from "zod/v4";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(32, "First name must be at most 32 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, apostrophes, and hyphens",
    ),

  lastName: z
    .string()
    .max(32, "Last name must be at most 32 characters")
    .regex(
      /^[a-zA-Z\s'-]*$/,
      "Last name can only contain letters, spaces, apostrophes, and hyphens",
    )
    .optional(),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Username can only contain letters, numbers, underscores, dots, and hyphens",
    ),

  email: z
    .email("Please enter a valid email address")
    .max(64, "Email must be at most 64 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter and one number",
    ),
});
