import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Should be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
