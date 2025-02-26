import { z } from "zod";

// Author schema
export const authorSchema = z.object({
  name: z.string(),
  role: z.string(),
  uid: z.string(),
  photoURL: z.string(),
});

// License detail schema
export const licenseDetailSchema = z.object({
  title: z.string().optional(),
  price: z.number().optional(),
  downloadUrl: z.string().url("Invalid download URL").optional(),
});

// Project schema
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  imageUrl: z.string().optional(),

  images: z.array(z.string()).default([]),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),

  typeCategory: z.string().min(1, "Category is required"),

  typeTitle: z.string().min(1, "Type title is required"),

  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either active or inactive",
  }),

  content: z.string().min(1, "Content is required"),

  stock: z
    .number()
    .min(0, "Stock must be 0 or greater")
    .int("Stock must be a whole number"),

  sold: z
    .number()
    .min(0, "Sold count must be 0 or greater")
    .int("Sold count must be a whole number")
    .default(0),

  downloads: z
    .number()
    .min(0, "Downloads must be 0 or greater")
    .int("Downloads must be a whole number")
    .default(0),

  delivery: z
    .number()
    .min(0, "Delivery count must be 0 or greater")
    .int("Delivery count must be a whole number")
    .default(0),

  licenseTitle: z.string().min(1, "License title is required"),

  licenseDetails: z
    .array(licenseDetailSchema)
    .min(1, "At least one license detail is required"),

  linkPreview: z
    .string()
    .url("Invalid preview URL")
    .optional()
    .or(z.literal("")),

  author: authorSchema,

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Export type
export type ProjectFormData = z.infer<typeof projectSchema>;

// Custom validation messages
export const validationMessages = {
  required: "This field is required",
  invalidUrl: "Please enter a valid URL",
  invalidSlug: "Slug can only contain lowercase letters, numbers, and hyphens",
  numberMin: "Value must be 0 or greater",
  numberInteger: "Value must be a whole number",
  invalidStatus: "Status must be either active or inactive",
};

// Helper function to format validation errors
export const formatValidationError = (error: z.ZodError) => {
  return error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
};
