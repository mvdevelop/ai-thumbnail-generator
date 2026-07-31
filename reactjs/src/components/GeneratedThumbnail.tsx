import React, { useRef, useState, useEffect } from "react";
import { Edit3, Download, Palette, Type, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { IThumbnail } from "../assets/assets";
import ExportButton from "./ExportButton";

interface GeneratedThumbnailProps {
  thumbnail: IThumbnail;
  onUpdate?: (updated: Partial<IThumbnail>) => void;
}

export default function GeneratedThumbnail({ thumbnail, onUpdate }: GeneratedThumbnailProps) {
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(thumbnail.isGenerating || false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  // Mock AI generation simulation
  useEffect(() => {
    if (thumbnail.isGenerating) {
      setIsGenerating(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            if (onUpdate) {
              onUpdate({ isGenerating: false, image_url: thumbnail.image_url || `/src/assets/thumb_${Math.floor(Math.random() * 7) + 1}.jpg` });
            }
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [thumbnail.isGenerating, thumbnail._id, onUpdate]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusColor = () => {
    if (isGenerating) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const getStatusText = () => {
    if (isGenerating) return "Generating...";
    return "Completed";
  };

  const toggleTextOverlay = () => {
    if (onUpdate) {
      onUpdate({ text_overlay: !thumbnail.text_overlay });
    }
  };

  const getColorClasses = () => {
    const colorScheme = thumbnail.color_scheme;
    switch (colorScheme) {
      case "vibrant":
        return {
          bg: "from-red-500/20 to-pink-500/20",
          border: "border-red-500/30",
          text: "text-red-400",
          accent: "bg-red-500"
        };
      case "ocean":
        return {
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          text: "text-blue-400",
          accent: "bg-blue-500"
        };
      case "forest":
        return {
          bg: "from-green-500/20 to-emerald-500/20",
          border: "border-green-500/30",
          text: "text-green-400",
          accent: "bg-green-500"
        };
      case "sunset":
        return {
          bg: "from-orange-500/20 to-red-500/20",
          border: "border-orange-500/30",
          text: "text-orange-400",
          accent: "bg-orange-500"
        };
      default:
        return {
          bg: "from-pink-500/20 to-purple-500/20",
          border: "border-pink-500/30",
          text: "text-pink-400",
          accent: "bg-pink-500"
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor()}`}>
          {isGenerating ? (
            <span className="flex items-center gap-1">
              <Loader2 className="animate-spin" size={12} />
              {getStatusText()}
            </span>
          ) : (
            getStatusText()
          )}
        </span>
      </div>

      {/* Thumbnail Display */}
      <div ref={thumbnailRef} className="aspect-video bg-slate-900 relative overflow-hidden">
        {/* Background Design */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg}`} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-white/5" />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          {/* Logo/Brand */}
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white text-center mb-2 max-w-xs truncate">
            {thumbnail.title}
          </h3>

          {/* Subtitle/Description */}
          <p className="text-sm text-gray-300 text-center mb-6 max-w-xs truncate">
            AI Generated Thumbnail
          </p>

          {/* Tech Elements */}
          <div className="flex gap-3 mb-4">
            <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/20">
              {thumbnail.style}
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/20">
              {thumbnail.aspect_ratio || "16:9"}
            </div>
            {thumbnail.text_overlay && (
              <div className="px-3 py-1 bg-pink-500/30 rounded-full text-xs text-pink-300 border border-pink-500/30">
                <Type size={10} className="inline mr-1" />
                Text Overlay
              </div>
            )}
          </div>

          {/* Progress Bar for Generating */}
          {isGenerating && (
            <div className="w-full max-w-xs mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {!isGenerating && thumbnail.image_url && (
            <div className="absolute inset-0 p-6 flex items-center justify-center">
              <img
                src={thumbnail.image_url}
                alt={thumbnail.title}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                onError={() => setError("Failed to load thumbnail image")}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
              <div className="text-center">
                <AlertCircle className="text-red-400 mx-auto mb-2" size={32} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full" />
      </div>

      {/* Thumbnail Info & Controls */}
      <div className="p-6 space-y-4">
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles size={14} className="text-pink-400" />
              {thumbnail.style}
            </span>
            <span className="flex items-center gap-1">
              <Palette size={14} className="text-blue-400" />
              {thumbnail.color_scheme}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <AlertCircle size={14} className="text-gray-500" />
            {formatDate(thumbnail.createdAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={toggleTextOverlay}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${thumbnail.text_overlay
              ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Type size={16} />
            {thumbnail.text_overlay ? "Remove Text" : "Add Text"}
          </button>

          <ExportButton
            thumbnailElement={thumbnailRef}
            filename={thumbnail.title}
            className="flex-1"
          />
        </div>
      </div>

      {/* Canvas for high-quality export (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}