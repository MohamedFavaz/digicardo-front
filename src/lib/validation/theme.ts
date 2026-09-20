import { z } from "zod";
import { FONT_ALLOWLIST } from "@/types/profile";

export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Color must be a valid hex format (#RRGGBB or #RGB)",
  });

export const ThemeTokensSchema = z.object({
  color_background: hexColorSchema,
  color_surface: hexColorSchema,
  color_text_primary: hexColorSchema,
  color_text_secondary: hexColorSchema,
  color_accent: hexColorSchema,
  font_family: z.enum(FONT_ALLOWLIST, {
    errorMap: () => ({ message: "Font family must be from the approved allowlist" }),
  }),
  button_radius: z.enum(["none", "small", "medium", "large", "pill"], {
    errorMap: () => ({ message: "Invalid button radius token" }),
  }),
  button_style: z.enum(["solid", "outline", "ghost", "soft", "glass"], {
    errorMap: () => ({ message: "Invalid button style token" }),
  }),
  animation: z.enum(["none", "fade", "slide", "scale"], {
    errorMap: () => ({ message: "Invalid animation token" }),
  }),
  // custom_options is a freeform JSON bag — accept any value (object, array, primitives).
  // We use z.any() here to avoid stripping VCard fields (products, banner_images, social_urls, etc.)
  custom_options: z.any().optional(),
});

export type ValidatedThemeTokens = z.infer<typeof ThemeTokensSchema>;
