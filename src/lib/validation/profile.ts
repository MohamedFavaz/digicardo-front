import { z } from "zod";

export const RESERVED_USERNAMES = [
  "admin",
  "api",
  "www",
  "app",
  "dashboard",
  "login",
  "register",
  "logout",
  "settings",
  "analytics",
  "profile",
  "support",
  "help",
  "pricing",
  "about",
  "terms",
  "privacy",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "p",
  "auth",
  "health",
  "explore",
  "docs",
  "assets",
  "static",
  "null",
  "undefined",
] as const;

export const UsernameRegex = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be 30 characters or fewer")
  .transform((val) => val.trim().toLowerCase())
  .refine((val) => UsernameRegex.test(val), {
    message:
      "Username must start with a letter or number and contain only lowercase letters, numbers, hyphens, and underscores",
  })
  .refine((val) => !RESERVED_USERNAMES.includes(val as (typeof RESERVED_USERNAMES)[number]), {
    message: "This username is reserved and cannot be claimed",
  });

export const CreateProfileSchema = z.object({
  username: UsernameSchema,
  display_name: z.string().max(100, "Display name must be 100 characters or fewer").nullable().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").nullable().optional(),
  avatar_url: z.string().url("Must be a valid URL").max(500).nullable().optional(),
  template_id: z.string().max(50).default("vcard"),
  is_public: z.boolean().default(true),
  seo_title: z.string().max(100).nullable().optional(),
  seo_description: z.string().max(300).nullable().optional(),
});

export const ProfileUpdateSchema = z.object({
  username: UsernameSchema.optional(),
  display_name: z.string().max(100, "Display name must be 100 characters or fewer").nullable().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").nullable().optional(),
  avatar_url: z.string().url("Must be a valid URL").max(500).nullable().optional(),
  template_id: z.string().max(50).optional(),
  is_public: z.boolean().optional(),
  seo_title: z.string().max(100).nullable().optional(),
  seo_description: z.string().max(300).nullable().optional(),
});

export type CreateProfileFormData = z.infer<typeof CreateProfileSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
