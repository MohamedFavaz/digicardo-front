export interface ProfileSeoData {
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  og_title: string | null;
  og_description: string | null;
  og_image_media_id: string | null;
  og_image_url?: string | null;
  indexable: boolean;
  updated_at?: string | null;
}

export interface UpdateProfileSeoRequest {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[];
  og_title?: string | null;
  og_description?: string | null;
  og_image_media_id?: string | null;
  indexable?: boolean;
}

export interface ResolvedMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  isIndexable: boolean;
}
