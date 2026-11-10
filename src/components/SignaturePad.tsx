import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SignaturePadProps {
  signatureUrl: string;
  onSignatureChange: (dataUrl: string) => void;
  defaultName: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureUrl,
  onSignatureChange,
  defaultName,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [inkColor, setInkColor] = useState<'blue' | 'black'>('blue');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const inkColorHex = inkColor === 'blue' ? '#003366' : '#111827';

  // Initialize canvas context
  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return ctx;
  };

  // Resize canvas for sharp retina display
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = inkColorHex;
    }
  }, [inkColorHex]);

  useEffect(() => {
    if (activeTab === 'draw') {
      setupCanvas();
    }
  }, [activeTab, setupCanvas]);

  // Update stroke style when ink color changes
  useEffect(() => {
    const ctx = getContext();
    if (ctx) {
      ctx.strokeStyle = inkColorHex;
    }
  }, [inkColorHex]);

  // Coordinates helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e) {
      // Prevent scrolling when drawing on touch screens
      e.stopPropagation();
    }
    const ctx = getContext();
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const ctx = getContext();
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Export PNG
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl);
  };

  // Clear signature
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
    onSignatureChange('');
  };

  // Handle uploaded signature image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSignatureChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'draw'
                ? 'bg-[#0b6623] text-white shadow-sm ring-1 ring-[#d4af37]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw Signature</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'upload'
                ? 'bg-[#0b6623] text-white shadow-sm ring-1 ring-[#d4af37]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Current status pill */}
        {signatureUrl ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> Signed
          </span>
        ) : (
          <span className="text-[11px] text-amber-400/90 font-medium">
            Pending Signature
          </span>
        )}
      </div>

      {activeTab === 'draw' ? (
        <div className="space-y-2">
          {/* Controls: Color picker and Clear */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Ink:</span>
              <button
                type="button"
                onClick={() => setInkColor('blue')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  inkColor === 'blue'
                    ? 'bg-blue-900/60 text-blue-200 border border-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
                title="Blue ink (Official academic standard)"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#003366] inline-block border border-blue-300"></span>
                <span>Navy Blue</span>
              </button>
              <button
                type="button"
                onClick={() => setInkColor('black')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  inkColor === 'black'
                    ? 'bg-slate-800 text-slate-100 border border-slate-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
                title="Black ink"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-black inline-block border border-slate-500"></span>
                <span>Black</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 hover:bg-slate-800/80 rounded"
              title="Clear canvas"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Interactive Canvas Pad */}
          <div className="relative w-full h-32 rounded-lg bg-white overflow-hidden border-2 border-slate-600 focus-within:border-[#d4af37] shadow-inner touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
              className="w-full h-full cursor-crosshair block"
              aria-label="Draw your signature here with finger or mouse"
            />
            {/* Signature guideline */}
            <div className="pointer-events-none absolute bottom-5 left-6 right-6 border-b border-dashed border-slate-300 flex justify-between text-[10px] text-slate-400 uppercase tracking-widest px-1">
              <span>Sign Above This Line</span>
              <span>✍</span>
            </div>
            {!hasDrawn && !signatureUrl && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic">
                Draw signature using mouse or finger on touch screen
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Upload File */
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 hover:border-[#d4af37] rounded-lg cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 transition-all p-3 text-center">
            <Upload className="w-6 h-6 text-[#d4af37] mb-1" />
            <span className="text-xs font-medium text-slate-200">
              Click or drag signature image here
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Supports PNG, JPG, or SVG (transparent background recommended)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {signatureUrl && (
            <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2">
                <img
                  src={signatureUrl}
                  alt="Signature preview"
                  className="h-9 w-auto max-w-[140px] object-contain bg-white/90 p-1 rounded"
                />
                <span className="text-xs text-slate-300">Active signature attached</span>
              </div>
              <button
                type="button"
                onClick={() => onSignatureChange('')}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
