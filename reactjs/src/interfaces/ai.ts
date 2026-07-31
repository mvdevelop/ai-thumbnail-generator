import type { ColorScheme } from "../assets/assets";
import type { ThumbnailStyle } from "../assets/assets";

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'stability' | 'dall-e' | 'midjourney';
  capabilities: {
    styleGeneration: boolean;
    colorSchemeMatching: boolean;
    promptOptimization: boolean;
    aspectRatioOptimization: boolean;
  };
  maxTokens: number;
  temperature: number;
  isPremium: boolean;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  category: 'style' | 'color' | 'composition' | 'prompt-engineering';
  template: string;
  variables: string[];
  isCustom: boolean;
}

export interface AIResponse {
  success: boolean;
  image_url: string;
  prompt_used: string;
  processing_time: number;
  model_used: string;
  cost: number;
  error?: string;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
  maxRequestsPerMinute: number;
  rateLimitRemaining: number;
  lastReset: Date;
  isConfigured: boolean;
}

export interface ProviderConfigs {
  openai: AIProviderConfig;
  anthropic: AIProviderConfig;
  stability: AIProviderConfig;
  dall_e: AIProviderConfig;
}

export interface TextToImageRequest {
  prompt: string;
  model: string;
  parameters: {
    aspectRatio: string;
    style: ThumbnailStyle;
    colorScheme: ColorScheme;
    numberOfImages?: number;
    quality?: 'standard' | 'hd';
    style_preset?: string;
    enhancement?: boolean;
  };
  userId: string;
}

export interface ImageGenerationResult {
  url: string;
  revised_prompt: string;
  seed: number;
  finish_reason: 'success' | 'error' | 'timeout';
}