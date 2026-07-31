import { Palette } from "lucide-react";
import type { ThumbnailStyle } from "../assets/assets";
import type React from "react";

type StyleSelectorProps = {
  value: ThumbnailStyle;
  onChange: (style: ThumbnailStyle) => void;
};

const styleOptions: { value: ThumbnailStyle; label: string; description: string; icon: string }[] = [
  {
    value: "Bold & Graphic",
    label: "Bold & Graphic",
    description: "High contrast, dramatic effects with bold colors",
    icon: "⚡"
  },
  {
    value: "Minimalist",
    label: "Minimalist",
    description: "Clean, simple designs with plenty of white space",
    icon: "✨"
  },
  {
    value: "Photorealistic",
    label: "Photorealistic",
    description: "Realistic imagery with natural lighting and textures",
    icon: "📸"
  },
  {
    value: "Illustrated",
    label: "Illustrated",
    description: "Hand-drawn style with creative illustrations",
    icon: "🎨"
  },
  {
    value: "Tech/Futuristic",
    label: "Tech/Futuristic",
    description: "Modern tech aesthetics with futuristic elements",
    icon: "🚀"
  },
];

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-200">Style</label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {styleOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${isSelected
                ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20"
                : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label={option.label}>{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{option.label}</div>
                  <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{option.description}</div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}