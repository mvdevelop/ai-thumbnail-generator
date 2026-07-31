import { useState } from "react";
import { Sparkles, Wand2, Lightbulb, Trash2, RotateCcw } from "lucide-react";
import { thumbnailStyles } from "../assets/assets";

interface PromptGeneratorProps {
  title: string;
  style: string;
  colorScheme: any;
  aspectRatio: string;
  additionalDetails: string;
  onPromptGenerated: (prompt: string) => void;
}

export default function PromptGenerator({
  title,
  style,
  colorScheme,
  aspectRatio,
  additionalDetails,
  onPromptGenerated,
}: PromptGeneratorProps) {
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrompt = () => {
    if (!title.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const styleInfo = thumbnailStyles.find(s => s.name === style);
      const templates = [
        `${title}. Professional ${styleInfo?.description.toLowerCase()}. Color scheme: ${colorScheme.name} (${colorScheme.colors.join(', ')}). Aspect ratio: ${aspectRatio}. Clean background, high contrast, suitable for YouTube thumbnail.`,
        `Create a striking thumbnail for "${title}". Use ${style} style with ${colorScheme.name} colors. Format: ${aspectRatio}. Eye-catching design with strong visual hierarchy and bold text elements.${additionalDetails ? ` ${additionalDetails}` : ''}`,
        `Thumbnail for "${title}" in ${style} style. Colors: ${colorScheme.name}. Ratio: ${aspectRatio}. Dynamic composition with vibrant imagery and engaging typography.${additionalDetails ? ` ${additionalDetails}` : ''}`,
        `Professional ${style} thumbnail titled "${title}". Color palette: ${colorScheme.name}. Layout: ${aspectRatio} format. Attention-grabbing design optimized for social media visibility.${additionalDetails ? ` ${additionalDetails}` : ''}`
      ];

      const randomPrompt = templates[Math.floor(Math.random() * templates.length)];
      setCurrentPrompt(randomPrompt);
      setGeneratedPrompts(prev => [randomPrompt, ...prev].slice(0, 5));
      setIsGenerating(false);
    }, 1500);
  };

  const selectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
    onPromptGenerated(prompt);
  };

  const clearPrompts = () => {
    setGeneratedPrompts([]);
    setCurrentPrompt("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wand2 className="text-pink-400" size={20} />
          AI Prompt Generator
        </h3>
        <button
          onClick={clearPrompts}
          className="text-zinc-400 hover:text-white transition-colors p-1"
          title="Clear prompts"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={generatePrompt}
          disabled={!title.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-zinc-600 disabled:to-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium"
        >
          {isGenerating ? (
            <>
              <Wand2 className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Prompt
            </>
          )}
        </button>

        {currentPrompt && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Generated Prompt:</span>
              <button
                onClick={() => onPromptGenerated(currentPrompt)}
                className="text-pink-400 hover:text-pink-300 text-sm font-medium"
              >
                Use This Prompt
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed">
              {currentPrompt}
            </p>
          </div>
        )}
      </div>

      {generatedPrompts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Lightbulb className="text-yellow-400" size={16} />
            Recent Prompts
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {generatedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => selectPrompt(prompt)}
                className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-pink-500/30 transition-all duration-200 group"
              >
                <p className="text-zinc-300 text-sm line-clamp-2 group-hover:text-white">
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
        <div className="text-xs text-zinc-500 space-y-1">
          <div className="flex justify-between">
            <span>Style:</span>
            <span className="text-pink-400">{style}</span>
          </div>
          <div className="flex justify-between">
            <span>Colors:</span>
            <span className="text-pink-400">{colorScheme.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Ratio:</span>
            <span className="text-pink-400">{aspectRatio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}