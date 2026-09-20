export interface MediaItem {
  id: string;
  type: "avatar" | "cover" | "block_image" | "link_thumbnail";
  url: string;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  size: number;
  created_at: string;
}

export interface UploadMediaResponse {
  success: boolean;
  data: MediaItem;
  meta?: {
    message?: string;
  };
}
