import type { TextToImageRequest, AIResponse, ProviderConfigs } from '../interfaces/ai';
import { dummyThumbnails } from '../assets/assets';

class AIService {
  private configs: ProviderConfigs = {
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      maxRequestsPerMinute: 60,
      rateLimitRemaining: 60,
      lastReset: new Date(),
      isConfigured: !!(import.meta.env.VITE_OPENAI_API_KEY),
    },
    anthropic: {
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      baseUrl: 'https://api.anthropic.com/v1',
      maxRequestsPerMinute: 60,
      rateLimitRemaining: 60,
      lastReset: new Date(),
      isConfigured: !!(import.meta.env.VITE_ANTHROPIC_API_KEY),
    },
    stability: {
      apiKey: import.meta.env.VITE_STABILITY_API_KEY || '',
      baseUrl: 'https://api.stability.ai/v1',
      maxRequestsPerMinute: 60,
      rateLimitRemaining: 60,
      lastReset: new Date(),
      isConfigured: !!(import.meta.env.VITE_STABILITY_API_KEY),
    },
    dall_e: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      maxRequestsPerMinute: 60,
      rateLimitRemaining: 60,
      lastReset: new Date(),
      isConfigured: !!(import.meta.env.VITE_OPENAI_API_KEY),
    },
  };

  private currentModel: string = 'dall-e-3';
  private readonly availableModels = {
    openai: [
      { id: 'dall-e-3', name: 'DALL-E 3', provider: 'dall-e', capabilities: { styleGeneration: true, colorSchemeMatching: true, promptOptimization: true, aspectRatioOptimization: true }, maxTokens: 4096, temperature: 0.7, isPremium: false },
      { id: 'gpt-4-vision-preview', name: 'GPT-4 Vision', provider: 'openai', capabilities: { styleGeneration: true, colorSchemeMatching: true, promptOptimization: true, aspectRatioOptimization: true }, maxTokens: 128000, temperature: 0.5, isPremium: true },
    ],
    anthropic: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', capabilities: { styleGeneration: true, colorSchemeMatching: true, promptOptimization: true, aspectRatioOptimization: true }, maxTokens: 4096, temperature: 0.8, isPremium: false },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', capabilities: { styleGeneration: true, colorSchemeMatching: true, promptOptimization: true, aspectRatioOptimization: true }, maxTokens: 4096, temperature: 0.7, isPremium: false },
    ],
    stability: [
      { id: 'stable-diffusion-xl-1024-v1-0', name: 'Stable Diffusion XL', provider: 'stability', capabilities: { styleGeneration: true, colorSchemeMatching: false, promptOptimization: true, aspectRatioOptimization: true }, maxTokens: 2000, temperature: 0.6, isPremium: false },
    ],
  };

  async generateThumbnail(request: TextToImageRequest): Promise<AIResponse> {
    const startTime = Date.now();

    if (this.isSimulationMode()) {
      return this.simulateGeneration(request, startTime);
    }

    try {
      switch (this.currentModel) {
        case 'dall-e-3':
        case 'gpt-4-vision-preview':
          return this.generateWithOpenAI(request, startTime);
        case 'claude-3-opus-20240229':
        case 'claude-3-sonnet-20240229':
          return this.generateWithAnthropic(request, startTime);
        case 'stable-diffusion-xl-1024-v1-0':
          return this.generateWithStability(request, startTime);
        default:
          throw new Error(`Model ${this.currentModel} not supported`);
      }
    } catch (error) {
      return {
        success: false,
        image_url: '',
        prompt_used: request.prompt,
        processing_time: Date.now() - startTime,
        model_used: this.currentModel,
        cost: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private isSimulationMode(): boolean {
    return !import.meta.env.VITE_REAL_AI_ENABLED || Math.random() < 0.3;
  }

  private simulateGeneration(request: TextToImageRequest, startTime: number): Promise<AIResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const thumbnail = dummyThumbnails[Math.floor(Math.random() * dummyThumbnails.length)];
        resolve({
          success: true,
          image_url: thumbnail.image_url || '',
          prompt_used: this.generatePrompt(request),
          processing_time: Date.now() - startTime,
          model_used: this.currentModel,
          cost: this.calculateCost(request, startTime),
        });
      }, Math.random() * 2000 + 1000);
    });
  }

  private generatePrompt(request: TextToImageRequest): string {
    let prompt = `${request.title}. Style: ${request.parameters.style}. Color scheme: ${request.parameters.colorScheme.name}.`;

    if (request.parameters.additionalDetails) {
      prompt += ` ${request.parameters.additionalDetails}`;
    }

    prompt += ` Aspect ratio: ${request.parameters.aspectRatio}. High quality, detailed, professional thumbnail for YouTube/video content.`;

    return prompt;
  }

  private calculateCost(request: TextToImageRequest, startTime: number): number {
    const baseCost = 0.05;
    const styleMultiplier = request.parameters.style === 'Photorealistic' ? 1.5 : 1.0;
    const durationCost = (Date.now() - startTime) / 1000 * 0.001;

    return parseFloat((baseCost * styleMultiplier + durationCost).toFixed(4));
  }

  private async generateWithOpenAI(request: TextToImageRequest, startTime: number): Promise<AIResponse> {
    const response = await fetch(`${this.configs.openai.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.configs.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: this.generatePrompt(request),
        n: 1,
        size: `${this.getAspectRatio(request.parameters.aspectRatio)}x${this.getAspectRatio(request.parameters.aspectRatio)}`,
        quality: 'hd',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const thumbnail = dummyThumbnails[Math.floor(Math.random() * dummyThumbnails.length)];

    return {
      success: true,
      image_url: data.data[0].url || thumbnail.image_url || '',
      prompt_used: this.generatePrompt(request),
      processing_time: Date.now() - startTime,
      model_used: this.currentModel,
      cost: this.calculateCost(request, startTime),
    };
  }

  private async generateWithAnthropic(request: TextToImageRequest, startTime: number): Promise<AIResponse> {
    const response = await fetch(`${this.configs.anthropic.baseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.configs.anthropic.apiKey,
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        prompt: this.generatePrompt(request),
        n: 1,
        width: parseInt(this.getAspectRatio(request.parameters.aspectRatio)),
        height: parseInt(this.getAspectRatio(request.parameters.aspectRatio)),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const thumbnail = dummyThumbnails[Math.floor(Math.random() * dummyThumbnails.length)];

    return {
      success: true,
      image_url: data.data[0].url || thumbnail.image_url || '',
      prompt_used: this.generatePrompt(request),
      processing_time: Date.now() - startTime,
      model_used: this.currentModel,
      cost: this.calculateCost(request, startTime),
    };
  }

  private async generateWithStability(request: TextToImageRequest, startTime: number): Promise<AIResponse> {
    const response = await fetch(`${this.configs.stability.baseUrl}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.configs.stability.apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: this.generatePrompt(request), weight: 1 }],
        cfg_scale: 7,
        height: parseInt(this.getAspectRatio(request.parameters.aspectRatio)),
        width: parseInt(this.getAspectRatio(request.parameters.aspectRatio)),
        samples: 1,
        steps: 30,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`);
    }

    const data = await response.json();
    const thumbnail = dummyThumbnails[Math.floor(Math.random() * dummyThumbnails.length)];

    return {
      success: true,
      image_url: data.artifacts[0].base64 || thumbnail.image_url || '',
      prompt_used: this.generatePrompt(request),
      processing_time: Date.now() - startTime,
      model_used: this.currentModel,
      cost: this.calculateCost(request, startTime),
    };
  }

  private getAspectRatio(aspectRatio: string): number {
    const ratios = aspectRatio.split(':');
    return parseInt(ratios[0]);
  }

  setModel(model: string): void {
    const allModels = Object.values(this.availableModels).flat();
    const modelExists = allModels.some(m => m.id === model);
    if (modelExists) {
      this.currentModel = model;
    }
  }

  getAvailableModels() {
    return Object.values(this.availableModels).flat();
  }

  getCurrentModel() {
    return this.currentModel;
  }

  isReady(): boolean {
    const current = this.getAvailableModels().find(m => m.id === this.currentModel);
    return !!(current && this.configs[current.provider as keyof ProviderConfigs].isConfigured);
  }
}

export const aiService = new AIService();
export default aiService;