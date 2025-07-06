import { z } from "zod/v4";

// Analysis form validation schema to match backend requirements
export const analysisFormSchema = z.object({
  selectedCondition: z
    .string()
    .min(1, "Medical condition is required")
    .max(50, "Medical condition must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9_\s-]+$/,
      "Medical condition can only contain letters, numbers, spaces, underscores, and hyphens",
    ),

  foodImage: z
    .instanceof(File, { message: "Please select a food image" })
    .refine(
      (file: File) => file.size <= 5 * 1024 * 1024, // 5MB max
      "File size must be less than 5MB",
    )
    .refine(
      (file: File) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      "Only JPEG, PNG, GIF, and WebP images are allowed",
    ),
});

// History query validation schema
export const historyQuerySchema = z.object({
  page: z
    .number()
    .min(1, "Page must be a positive number")
    .optional()
    .default(1),
  limit: z
    .number()
    .min(1)
    .max(50, "Limit must be between 1 and 50")
    .optional()
    .default(10),
  sortBy: z
    .enum(["createdAt", "medicalCondition", "result.predicted_food"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types for form validation
export type AnalysisFormData = z.infer<typeof analysisFormSchema>;
export type HistoryQueryData = z.infer<typeof historyQuerySchema>;

// Error handler utility for backend validation errors
export function handleBackendValidationError(error: any): string {
  if (error.response?.data?.error) {
    const fieldErrors = error.response.data.error;

    // Convert field errors to user-friendly message
    const errorMessages: string[] = [];

    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (Array.isArray(messages)) {
        errorMessages.push(...messages);
      } else if (typeof messages === "string") {
        errorMessages.push(messages);
      }
    }

    return errorMessages.join(". ");
  }

  return error.response?.data?.message || error.message || "An error occurred";
}
