/**
 * Agent Management System — TypeScript types
 * Used across admin agent pages and agent panel.
 */

// ─── Agent Role Extension ──────────────────────────────────────────────────
export type UserRole = 'user' | 'moderator' | 'agent' | 'admin';

// ─── Agent Quota ────────────────────────────────────────────────────────────
export interface AgentQuota {
  id: string;
  agent_id: string;
  card_limit: number;
  cards_used: number;
  restore_on_delete: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Agent Commission Config ────────────────────────────────────────────────
export interface AgentCommissionConfig {
  id: string;
  agent_id: string | null;
  card_price: number;
  agent_commission: number;
  admin_profit: number;
  pricing_model: 'fixed' | 'percentage';
  created_at: string;
  updated_at: string;
}

// ─── Agent Card ─────────────────────────────────────────────────────────────
export type AgentCardStatus = 'active' | 'inactive' | 'suspended';

export interface AgentCard {
  id: string;
  agent_id: string;
  customer_user_id: string;
  profile_id: string;
  card_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: AgentCardStatus;
  revenue: number;
  agent_commission: number;
  admin_profit: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Loaded relations
  profile?: {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    is_public: boolean;
    template_id: string | null;
  };
  customer_user?: {
    id: string;
    name: string;
    email: string;
    username?: string;
    status: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
}

// ─── Agent Transaction ──────────────────────────────────────────────────────
export type TransactionType = 'card_sale' | 'commission_payment' | 'adjustment';

export interface AgentTransaction {
  id: string;
  agent_id: string;
  agent_card_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  created_at: string;
}

// ─── Agent Payment Record ───────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface AgentPaymentRecord {
  id: string;
  agent_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  agent?: {
    id: string;
    name: string;
    email: string;
  };
}

// ─── Agent User (extends base User) ─────────────────────────────────────────
export interface AgentUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: 'agent';
  status: string;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  // Loaded relations
  agent_quota?: AgentQuota;
  commission_config?: AgentCommissionConfig;
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────
export interface AgentDashboardStats {
  total_cards: number;
  active_cards: number;
  card_limit: number;
  cards_used: number;
  remaining_credits: number;
  total_revenue: number;
  total_commission: number;
  monthly_cards: Record<string, number>;
  monthly_revenue: Record<string, number>;
  recent_cards: AgentCard[];
  earnings: AgentEarnings;
}

export interface AgentEarnings {
  total_revenue: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
  total_cards_sold: number;
}

// ─── Admin Agent Dashboard Stats ────────────────────────────────────────────
export interface AdminAgentDashboardStats {
  stats: {
    total_agents: number;
    active_agents: number;
    total_agent_cards: number;
    total_revenue: number;
    total_profit: number;
    total_commission: number;
    pending_payments: number;
  };
  performance_table: AgentPerformanceRow[];
}

export interface AgentPerformanceRow {
  agent: AgentUser;
  cards_created: number;
  card_limit: number;
  revenue: number;
  profit: number;
  commission: number;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

