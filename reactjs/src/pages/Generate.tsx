import { useState } from "react";
import { useParams } from "react-router-dom";
import type { IThumbnail, ThumbnailStyle, ColorScheme } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import ModelSelector from "../components/ModelSelector";
import PromptGenerator from "../components/PromptGenerator";
import { aspectRatios, type AspectRatio } from "../assets/assets";
import { aiService } from "../lib/ai-service";

const Generate = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [colorScheme, setColorScheme] = useState<ColorScheme>({ id: "vibrant", name: "Vibrant", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] });
  const [selectedModel, setSelectedModel] = useState<string>(aiService.getCurrentModel());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
  };

  const canGenerate = title.trim().length > 0 && aiService.isReady();

  return (
    <>
      <SoftBackdrop />

      <div className="pt-24 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400 mb-3">Describe your vision and let AI bring it to life!</p>

                  <div className="space-y-5">
                    {/* TITLE INPUT */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title or Topic</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="e.g., 10 Tips for Better Sleep" className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                      <div className="flex justify-end">
                        <span className="text-xs text-zinc-400">{title.length}/100</span>
                      </div>
                    </div>

                    {/* AspectRatioSelector */}
                    <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />

                    {/* StyleSelector */}
                    <StyleSelector value={style} onChange={setStyle} />

                    {/* ColorSchemeSelector */}
                    <ColorSchemeSelector value={colorScheme} onChange={setColorScheme} />

                    {/* Model Selector */}
                    <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />

                    {/* Details */}
                    <div className='space-y-2'>
                      <label className="block text-sm font-medium">
                        Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                      </label>
                      <textarea value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3} placeholder="Add any specific elements, mood, or style preferences..." className="w-full px-4 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none mt-1 mb-4 py-4" />
                    </div>

                    {/* Prompt Generator */}
                    <PromptGenerator
                      title={title}
                      style={style}
                      colorScheme={colorScheme}
                      aspectRatio={aspectRatio}
                      additionalDetails={additionalDetails}
                      onPromptGenerated={handlePromptGenerated}
                    />
                  </div>

                  {/* GENERATED PROMPT DISPLAY */}
                  {generatedPrompt && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-xs text-green-400 font-medium mb-1">Generated Prompt Ready:</p>
                      <p className="text-sm text-zinc-300 line-clamp-2">"{generatedPrompt}"</p>
                    </div>
                  )}

                  {/* BUTTON */}
                  {!id && (
                    <button
                      className={`text-[15px] w-full py-3.5 rounded-xl font-medium transition-colors ${canGenerate
                        ? "bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700"
                        : "bg-gray-600 cursor-not-allowed opacity-50"
                      }`}
                      disabled={!canGenerate}
                    >
                      Generate Thumbnail
                    </button>
                  )}

                  {/* AI Status */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">AI Model:</span>
                      <span className={`font-medium ${aiService.isReady() ? "text-green-400" : "text-yellow-400"}`}>
                        {selectedModel} - {aiService.isReady() ? "Ready" : "Not Configured"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Generated Thumbnail Preview */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                <h3 className="text-xl font-bold text-zinc-100 mb-4">Preview</h3>
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-xl">AI</span>
                    </div>
                    <p className="text-gray-400">Your thumbnail preview will appear here</p>
                    <p className="text-sm text-zinc-500">Configure your settings and click "Generate Thumbnail"</p>
                  </div>
                </div>
              </div>

              {/* Selected Options */}
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                <h3 className="text-xl font-bold text-zinc-100 mb-4">Selected Options</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-400">Aspect Ratio:</span>
                    <span className="text-white font-medium">{aspectRatio}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-400">Style:</span>
                    <span className="text-white font-medium">{style}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">Color Scheme:</span>
                    <span className="text-white font-medium">{colorScheme.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Generate;