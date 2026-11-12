import { z } from "zod";

/**
 * Agent Management System — Zod validation schemas.
 * Must stay in sync with Laravel FormRequest validations.
 */

// ─── Agent Login ────────────────────────────────────────────────────────────
export const agentLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type AgentLoginInput = z.infer<typeof agentLoginSchema>;

// ─── Create Agent (Admin) ───────────────────────────────────────────────────
export const createAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10).max(20).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  card_limit: z.coerce.number().int().min(1, "Must allow at least 1 card").max(100000),
  card_price: z.coerce.number().min(0).optional(),
  agent_commission: z.coerce.number().min(0).optional(),
  restore_on_delete: z.boolean().optional(),
});
export type CreateAgentInput = z.infer<typeof createAgentSchema>;

// ─── Update Agent (Admin) ───────────────────────────────────────────────────
export const updateAgentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  mobile: z.string().min(10).max(20).optional().or(z.literal("")),
  password: z.string().min(8).optional().or(z.literal("")),
  status: z.enum(["active", "suspended", "banned"]).optional(),
  card_limit: z.coerce.number().int().min(0).max(100000).optional(),
  card_price: z.coerce.number().min(0).optional(),
  agent_commission: z.coerce.number().min(0).optional(),
  restore_on_delete: z.boolean().optional(),
});
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;

// ─── Create Card (Agent) ────────────────────────────────────────────────────
export const createAgentCardSchema = z.object({
  customer_name: z.string().min(2, "Customer name is required").max(150),
  customer_email: z.string().email("Valid email is required"),
  customer_phone: z.string().max(20).optional().or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, hyphens, underscores"),
  display_name: z.string().min(2).max(150).optional().or(z.literal("")),
  card_name: z.string().max(150).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  template_id: z.string().optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  notes: z.string().max(500).optional().or(z.literal("")),
});
export type CreateAgentCardInput = z.infer<typeof createAgentCardSchema>;

// ─── Record Payment (Admin) ─────────────────────────────────────────────────
export const recordPaymentSchema = z.object({
  agent_id: z.string().min(1, "Agent is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  status: z.enum(["pending", "paid", "failed"]).default("paid"),
  payment_method: z.string().max(100).optional(),
  reference_number: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

