import { aspectRatios, type ThumbnailStyle, type ColorScheme } from "../assets/assets";

export interface ThumbnailInput {
  title: string;
  aspectRatio: typeof aspectRatios[number];
  style: ThumbnailStyle;
  colorScheme: ColorScheme;
  additionalDetails?: string;
}

export interface GeneratedThumbnail extends IThumbnail {
  _id: string;
  title: string;
  description?: string;
  style: "Bold & Graphic" | "Tech/Futuristic" | "Minimalist" | "Photorealistic" | "Illustrated";
  aspect_ratio?: "16:9" | "1:1" | "9:16";
  color_scheme?: "vibrant" | "sunset" | "forest" | "neon" | "purple" | "monochrome" | "ocean" | "pastel";
  text_overlay?: boolean;
  image_url?: string;
  prompt_used?: string;
  user_prompt?: string;
  isGenerating?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}