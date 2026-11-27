import { z } from "zod";
import { createAgentCardSchema } from "./agent";

/**
 * Franchise panel — Zod schemas. Kept in sync with the Laravel validation in
 * Api/V1/Franchise/* and Api/V1/Admin/AdminFranchiseController.
 */

export const franchiseLoginSchema = z.object({
  email: z.string().min(3, "Enter your email or mobile number").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Owner adds a staff member. A percentage commission is of the card's sale amount. */
export const createStaffSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Valid email is required"),
    mobile: z.string().min(10, "Mobile number is too short").max(20).optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    commission_type: z.enum(["fixed", "percentage"]),
    commission_value: z.coerce.number().min(0, "Cannot be negative").max(100000),
  })
  .refine((v) => v.commission_type !== "percentage" || v.commission_value <= 100, {
    message: "A percentage commission cannot be more than 100.",
    path: ["commission_value"],
  });
export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  mobile: z.string().min(10).max(20).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  status: z.enum(["active", "suspended"]).optional(),
  commission_type: z.enum(["fixed", "percentage"]).optional(),
  commission_value: z.coerce.number().min(0).max(100000).optional(),
});

export const staffPaymentSchema = z.object({
  amount: z.coerce.number().min(1, "Enter the amount paid").max(1000000),
  method: z.string().max(40).optional().or(z.literal("")),
  note: z.string().max(255).optional().or(z.literal("")),
  paid_on: z.string().optional().or(z.literal("")),
});

/** Franchise card = agent card + optional amount collected from the customer. */
export const createFranchiseCardSchema = createAgentCardSchema.extend({
  sale_amount: z.coerce.number().min(0, "Cannot be negative").max(1000000).optional(),
  /** Owner only: who took the order (owner or staff id). */
  taken_by_id: z.string().length(26).optional(),
});

/** Admin creates a franchise (same limits/pricing fields as an agent). */
export const createFranchiseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10).max(20).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  card_limit: z.coerce.number().int().min(1, "Must allow at least 1 card").max(100000),
  card_price: z.coerce.number().min(0).optional(),
});
export type CreateFranchiseInput = z.infer<typeof createFranchiseSchema>;
