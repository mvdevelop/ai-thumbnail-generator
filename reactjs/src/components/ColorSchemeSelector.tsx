import { PaintBucket } from "lucide-react";
import type { ColorScheme } from "../assets/assets";
import type React from "react";

type ColorSchemeSelectorProps = {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
};

const ColorSchemeSelector = ({ value, onChange }: ColorSchemeSelectorProps) => {
  const getColorSchemeClass = (colors: string[]) => {
    return colors.map((color, index) => (
      <div
        key={index}
        className="w-6 h-6 rounded-full border border-white/20"
        style={{ backgroundColor: color }}
      />
    ));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-200">Color Scheme</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[
          { id: "vibrant", name: "Vibrant", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] },
          { id: "sunset", name: "Sunset", colors: ["#FF8C42", "#FF3C38", "#A23B72"] },
          { id: "ocean", name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF"] },
          { id: "forest", name: "Forest", colors: ["#2D6A4F", "#40916C", "#95D5B2"] },
          { id: "purple", name: "Purple Dream", colors: ["#7B2CBF", "#9D4EDD", "#C77DFF"] },
          { id: "monochrome", name: "Monochrome", colors: ["#212529", "#495057", "#ADB5BD"] },
          { id: "neon", name: "Neon", colors: ["#FF00FF", "#00FFFF", "#FFFF00"] },
          { id: "pastel", name: "Pastel", colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB"] },
        ].map((scheme) => {
          const isSelected = value.id === scheme.id;

          return (
            <button
              key={scheme.id}
              type="button"
              onClick={() => onChange(scheme)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${isSelected
                ? "border-pink-500 bg-pink-500/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <PaintBucket size={16} className="text-zinc-400" />
                <span className="text-sm font-medium text-white">{scheme.name}</span>
              </div>

              <div className="flex gap-1.5">
                {scheme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {isSelected && (
                <div className="mt-2 flex justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;