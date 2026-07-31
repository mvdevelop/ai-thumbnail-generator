import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import type { IThumbnail } from "../assets/assets";
import { dummyThumbnails } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import { Clock, Image as ImageIcon, Loader2, AlertCircle, Filter } from "lucide-react";

export default function MyGeneration() {
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const savedThumbnails = localStorage.getItem("generatedThumbnails");
        if (savedThumbnails) {
          setThumbnails(JSON.parse(savedThumbnails));
        } else {
          setThumbnails(dummyThumbnails);
        }
      } catch (err) {
        setError("Failed to load your generated thumbnails");
        console.error("Error fetching thumbnails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnails();
  }, []);

  const filteredThumbnails = thumbnails.filter((thumbnail) => {
    if (filter === "all") return true;
    if (filter === "generating") return thumbnail.isGenerating || false;
    if (filter === "completed") return !thumbnail.isGenerating;
    return true;
  });

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusColor = (thumbnail: IThumbnail) => {
    if (thumbnail.isGenerating) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const getStatusText = (thumbnail: IThumbnail) => {
    return thumbnail.isGenerating ? "Generating..." : "Completed";
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 relative overflow-hidden">
      <SoftBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Generated Thumbnails</h1>
          <p className="text-gray-400">Manage and view all your AI-generated thumbnails</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-lg border border-white/10 w-fit">
          {[
            { key: "all", label: "All", icon: ImageIcon },
            { key: "completed", label: "Completed", icon: Filter },
            { key: "generating", label: "Generating", icon: Loader2 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filter === key
                ? "bg-pink-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-pink-500 mb-4" size={40} />
            <p className="text-gray-400">Loading your thumbnails...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredThumbnails.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No thumbnails found</h3>
            <p className="text-gray-400 mb-6">
              {filter === "all"
                ? "You haven't generated any thumbnails yet."
                : `No ${filter} thumbnails found.`
              }
            </p>
            <Link
              to="/generate"
              className="inline-block px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Thumbnail
            </Link>
          </div>
        )}

        {/* Thumbnails Grid */}
        {!loading && !error && filteredThumbnails.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredThumbnails.map((thumbnail) => (
                <motion.div
                  key={thumbnail._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-pink-500/30 transition-all duration-300"
                >
                  <Link to={`/generate/${thumbnail._id}`} className="block">
                    <div className="aspect-video bg-slate-900 relative">
                      <img
                        src={thumbnail.image_url}
                        alt={thumbnail.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(thumbnail)}`}>
                          {getStatusText(thumbnail)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors">
                        {thumbnail.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(thumbnail.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon size={12} />
                          {thumbnail.aspect_ratio || "16:9"}
                        </div>
                      </div>

                      {thumbnail.isGenerating && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-pink-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}