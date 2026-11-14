import type { ProfileBlock } from "./blocks";
import type { ThemeTokens, Profile } from "./profile";

export type CardCategoryType =
  | "business"
  | "personal"
  | "portfolio"
  | "restaurant"
  | "freelancer"
  | "agency"
  | "education"
  | "healthcare"
  | "real_estate"
  | "creative"
  | "nonprofit"
  | "event";

export interface CardCategoryOption {
  id: CardCategoryType;
  label: string;
  description: string;
  iconName: string;
  recommendedTemplate: string;
}

export const CARD_CATEGORIES: CardCategoryOption[] = [
  {
    id: "business",
    label: "Business",
    description: "Corporate & enterprise digital cards with contact actions",
    iconName: "Briefcase",
    recommendedTemplate: "vcard",
  },
  {
    id: "personal",
    label: "Personal",
    description: "Personal bio, contact links, and social profiles",
    iconName: "User",
    recommendedTemplate: "vcard",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Showcase creative work, projects, and client testimonials",
    iconName: "Palette",
    recommendedTemplate: "botanical",
  },
  {
    id: "restaurant",
    label: "Restaurant & Cafe",
    description: "Digital menus, booking, location maps, and WhatsApp ordering",
    iconName: "Utensils",
    recommendedTemplate: "vcard",
  },
  {
    id: "freelancer",
    label: "Freelancer",
    description: "Services, rates, booking calendar, and client inquiries",
    iconName: "Laptop",
    recommendedTemplate: "vcard",
  },
  {
    id: "agency",
    label: "Agency",
    description: "Team profiles, corporate credentials, and proposal requests",
    iconName: "Building2",
    recommendedTemplate: "botanical",
  },
  {
    id: "creative",
    label: "Creative & Artist",
    description: "Music, photography, design showcases, and social channels",
    iconName: "Sparkles",
    recommendedTemplate: "botanical",
  },
  {
    id: "healthcare",
    label: "Healthcare & Clinic",
    description: "Doctor appointments, clinic location, and patient contact",
    iconName: "Stethoscope",
    recommendedTemplate: "vcard",
  },
  {
    id: "real_estate",
    label: "Real Estate",
    description: "Property listings, direct agent WhatsApp, and brochures",
    iconName: "Home",
    recommendedTemplate: "botanical",
  },
  {
    id: "education",
    label: "Education & Tutor",
    description: "Courses, tutor credentials, and student registration",
    iconName: "GraduationCap",
    recommendedTemplate: "vcard",
  },
  {
    id: "nonprofit",
    label: "Nonprofit & Charity",
    description: "Causes, donation links, and volunteer coordinator contact",
    iconName: "Heart",
    recommendedTemplate: "botanical",
  },
  {
    id: "event",
    label: "Event & Conference",
    description: "Event schedule, venue directions, and RSVP registration",
    iconName: "Calendar",
    recommendedTemplate: "vcard",
  },
];

export interface CardItem {
  id: string;
  user_id: string;
  card_title: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  template_id: string;
  category: {
    value: CardCategoryType;
    label: string;
  };
  status: {
    value: "draft" | "published" | "archived";
    label: string;
  };
  is_primary: boolean;
  is_public: boolean;
  published_at: string | null;
  published_url: string | null;
  theme_tokens: ThemeTokens | null;
  seo_title: string | null;
  seo_description: string | null;
  version: number;
  blocks_count?: number;
  blocks?: ProfileBlock[];
  created_at: string;
  updated_at: string;
}

export interface CreateCardInput {
  category: CardCategoryType;
  template_id: string;
  card_title?: string;
  display_name?: string;
  bio?: string;
  username?: string;
  avatar_url?: string;
  cover_url?: string;
  theme_tokens?: ThemeTokens;
}

export interface UpdateCardInput {
  card_title?: string;
  category?: CardCategoryType;
  status?: "draft" | "published" | "archived";
  display_name?: string;
  bio?: string;
  username?: string;
  avatar_url?: string;
  cover_url?: string;
  template_id?: string;
  theme_tokens?: ThemeTokens;
  is_public?: boolean;
  seo_title?: string;
  seo_description?: string;
  version: number;
}
