import React, { useState } from "react";
import { Download, Image as ImageIcon, FileText, Loader2, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { toPng, toJpeg } from "html-to-image";

interface ExportButtonProps {
  thumbnailElement: React.RefObject<HTMLDivElement>;
  filename: string;
  className?: string;
}

export default function ExportButton({ thumbnailElement, filename, className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success'>('idle');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  const exportAsPNG = async () => {
    if (!thumbnailElement.current) return null;

    try {
      // Use html2canvas for better quality on complex elements
      const canvas = await html2canvas(thumbnailElement.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      throw error;
    }
  };

  const exportAsJPEG = async () => {
    if (!thumbnailElement.current) return null;

    try {
      // Use html-to-image with quality settings
      const dataUrl = await toJpeg(thumbnailElement.current, {
        quality: 0.95,
        width: thumbnailElement.current.width * 2,
        height: thumbnailElement.current.height * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: thumbnailElement.current.width + 'px',
          height: thumbnailElement.current.height + 'px',
          position: 'absolute',
          left: '0',
          top: '0',
        }
      });

      return dataUrl;
    } catch (error) {
      console.error('Error exporting as JPEG:', error);
      throw error;
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    if (!thumbnailElement.current) return;

    setIsExporting(true);
    setExportStatus('exporting');
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let dataUrl: string;

      if (exportFormat === 'png') {
        dataUrl = await exportAsPNG();
      } else {
        dataUrl = await exportAsJPEG();
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      if (dataUrl) {
        downloadImage(dataUrl, `${filename}.${exportFormat}`);
        setExportStatus('success');

        // Reset success state after 3 seconds
        setTimeout(() => {
          setExportStatus('idle');
          setExportProgress(0);
        }, 3000);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('idle');
      setExportProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>      <div className="flex flex-col gap-2">
        {/* Export Format Toggle */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setExportFormat('png')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${exportFormat === 'png'
              ? "bg-pink-500 text-white"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <ImageIcon size={16} />
            PNG
          </button>
          <button
            onClick={() => setExportFormat('jpeg')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${exportFormat === 'jpeg'
              ? "bg-pink-500 text-white"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText size={16} />
            JPEG
          </button>
        </div>

        {/* Main Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || !thumbnailElement.current}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isExporting
            ? "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            : exportStatus === 'success'
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Exporting... {exportProgress}%</span>
            </>
          ) : exportStatus === 'success' ? (
            <>
              <CheckCircle size={20} />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download {exportFormat.toUpperCase()}</span>
            </>
          )}
        </button>

        {/* Progress Bar */}
        {isExporting && (
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-pink-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}