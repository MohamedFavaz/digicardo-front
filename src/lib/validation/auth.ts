import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or username is required")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name must not exceed 255 characters")
      .transform((val) => val.trim()),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters")
      .transform((val) => val.trim().toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
