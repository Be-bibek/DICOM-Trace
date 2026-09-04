import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Binary, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Check, 
  AlertTriangle,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { DicomScan } from '../types';

interface XRayViewerCardProps {
  scan: DicomScan;
  isBreached: boolean;
  tamperCoords?: { x: number; y: number };
  onOpenUploadScan?: () => void;
}

export const XRayViewerCard: React.FC<XRayViewerCardProps> = ({
  scan,
  isBreached,
  tamperCoords = { x: 142, y: 288 },
  onOpenUploadScan
}) => {
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [invertGrayscale, setInvertGrayscale] = useState<boolean>(false);
  const [inspectLsbWatermark, setInspectLsbWatermark] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const loc = scan.localization;

  return (
    <div 
      id="fracture-localization-card"
      className="p-4 milk-card relative flex flex-col transition-all duration-300 overflow-hidden"
    >
      {/* Header & Status */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Fracture Localization Engine
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
          {onOpenUploadScan && (
            <button
              onClick={onOpenUploadScan}
              className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-500/40 font-bold flex items-center gap-1 transition-all"
              title="Replace demo image with your own"
            >
              <UploadCloud className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>Replace Image</span>
            </button>
          )}
          <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {scan.modality.split(' ')[0]}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            16-bit
          </span>
        </div>
      </div>

      {/* Main Radiograph Viewport */}
      <div 
        className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border transition-all duration-300 select-none ${
          invertGrayscale
            ? 'bg-slate-100 border-slate-300'
            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black border-slate-800'
        } ${isBreached ? 'ring-2 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]' : 'shadow-inner'}`}
      >
        {/* Radiograph Container (Custom Image or Built-in SVG) */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300 relative"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {scan.customImageUrl ? (
            /* User Uploaded Custom Image Viewport with AI Overlays */
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={scan.customImageUrl} 
                alt="Custom Clinical Scan"
                className={`max-w-full max-h-full object-contain ${
                  invertGrayscale ? 'invert contrast-125' : 'contrast-115'
                }`}
              />

              {/* SVG Overlay layer on top of custom image */}
              <svg 
                viewBox="0 0 400 300" 
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {/* LSB Watermark Grid */}
                {inspectLsbWatermark && (
                  <rect x="0" y="0" width="400" height="300" fill="url(#lsbPattern)" opacity="0.35" />
                )}

                {/* AI Bounding Box */}
                {showAiOverlay && (
                  <g>
                    <rect
                      x="110"
                      y="70"
                      width="130"
                      height="100"
                      rx="8"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                    />
                    <g transform="translate(110, 52)">
                      <rect width="130" height="18" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="0.75" />
                      <text x="65" y="12" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        [AI: {loc.label}]
                      </text>
                    </g>
                  </g>
                )}

                {/* Tamper breach marker if breached */}
                {isBreached && (
                  <g>
                    <circle cx={tamperCoords.x} cy={tamperCoords.y} r="14" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
                    <circle cx={tamperCoords.x} cy={tamperCoords.y} r="4" fill="#f43f5e" />
                    <rect x={tamperCoords.x - 60} y={tamperCoords.y - 38} width="120" height="18" rx="4" fill="#e11d48" />
                    <text x={tamperCoords.x} y={tamperCoords.y - 25} fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      TAMPERED BIT: LSB-FLIP
                    </text>
                  </g>
                )}
              </svg>
            </div>
          ) : (
            /* Built-in Radiograph SVG */
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full object-contain"
              aria-label="Clinical Wrist Radiograph"
            >
            <defs>
              {/* Bone gradients */}
              <radialGradient id="radiusBoneGrad" cx="45%" cy="60%" r="55%">
                <stop offset="0%" stopColor={invertGrayscale ? "#2b2b2b" : "#e2e8f0"} stopOpacity={invertGrayscale ? 0.95 : 0.95} />
                <stop offset="60%" stopColor={invertGrayscale ? "#475569" : "#cbd5e1"} stopOpacity={invertGrayscale ? 0.8 : 0.85} />
                <stop offset="100%" stopColor={invertGrayscale ? "#94a3b8" : "#64748b"} stopOpacity={invertGrayscale ? 0.35 : 0.3} />
              </radialGradient>

              <radialGradient id="ulnaBoneGrad" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor={invertGrayscale ? "#334155" : "#e2e8f0"} stopOpacity={0.9} />
                <stop offset="70%" stopColor={invertGrayscale ? "#64748b" : "#94a3b8"} stopOpacity={0.7} />
                <stop offset="100%" stopColor={invertGrayscale ? "#cbd5e1" : "#475569"} stopOpacity={0.25} />
              </radialGradient>

              {/* Glowing Amber AI Bounding Box Pattern */}
              <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f97316" floodOpacity="0.5" />
              </filter>

              {/* Fracture Line Glow */}
              <filter id="fractureLineGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ef4444" floodOpacity="0.9" />
              </filter>

              {/* LSB Watermark Grid Pattern */}
              <pattern id="lsbPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" />
                <circle cx="5" cy="5" r="0.75" fill="#10b981" fillOpacity="0.6" />
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.25" />
              </pattern>
            </defs>

            {/* Subtle soft-tissue background shadow */}
            <ellipse 
              cx="200" 
              cy="160" 
              rx="150" 
              ry="110" 
              fill={invertGrayscale ? "#e2e8f0" : "#1e293b"} 
              opacity="0.3" 
            />

            {/* Forearm - Radius (Lateral / Radial side, larger flared distal end) */}
            <path
              d="M 110,290 
                 L 115,220 
                 C 118,170 120,150 125,120 
                 C 128,100 135,80 155,75 
                 C 185,70 215,75 220,95 
                 C 225,115 210,140 205,170 
                 C 195,210 185,250 180,290 
                 Z"
              fill="url(#radiusBoneGrad)"
              stroke={invertGrayscale ? "#0f172a" : "#ffffff"}
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />

            {/* Forearm - Ulna (Medial side with styloid process) */}
            <path
              d="M 215,290 
                 L 220,230 
                 C 224,180 230,140 238,110 
                 C 242,95 248,85 260,88 
                 C 272,92 270,110 266,135 
                 C 260,175 255,230 250,290 
                 Z"
              fill="url(#ulnaBoneGrad)"
              stroke={invertGrayscale ? "#0f172a" : "#ffffff"}
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />

            {/* Distal Radioulnar Joint (DRUJ) space */}
            <path 
              d="M 218,92 C 222,120 220,150 212,185" 
              stroke={invertGrayscale ? "#ffffff" : "#0f172a"} 
              strokeWidth="1.5" 
              opacity="0.6" 
            />

            {/* Carpal Bones Cluster (Proximal & Distal Rows in radiopaque silhouettes) */}
            {/* Scaphoid */}
            <ellipse cx="145" cy="55" rx="14" ry="11" transform="rotate(-15 145 55)" fill={invertGrayscale ? "#3b4252" : "#e2e8f0"} opacity="0.85" />
            {/* Lunate */}
            <ellipse cx="178" cy="52" rx="12" ry="10" fill={invertGrayscale ? "#3b4252" : "#e2e8f0"} opacity="0.8" />
            {/* Triquetrum */}
            <ellipse cx="205" cy="54" rx="10" ry="8" fill={invertGrayscale ? "#4c566a" : "#cbd5e1"} opacity="0.75" />
            {/* Pisiform */}
            <circle cx="216" cy="58" r="5" fill={invertGrayscale ? "#2e3440" : "#f1f5f9"} opacity="0.85" />

            {/* Distal row: Trapezium, Trapezoid, Capitate, Hamate */}
            <ellipse cx="135" cy="32" rx="11" ry="9" fill={invertGrayscale ? "#475569" : "#cbd5e1"} opacity="0.7" />
            <ellipse cx="155" cy="30" rx="10" ry="8" fill={invertGrayscale ? "#475569" : "#cbd5e1"} opacity="0.7" />
            <ellipse cx="180" cy="27" rx="14" ry="11" fill={invertGrayscale ? "#334155" : "#e2e8f0"} opacity="0.85" />
            <ellipse cx="206" cy="31" rx="12" ry="9" fill={invertGrayscale ? "#475569" : "#cbd5e1"} opacity="0.75" />

            {/* Metacarpal Bases (1 to 5) */}
            <path d="M 115,0 L 125,20 L 138,20 L 130,0 Z" fill={invertGrayscale ? "#64748b" : "#94a3b8"} opacity="0.5" />
            <path d="M 142,0 L 148,18 L 164,18 L 158,0 Z" fill={invertGrayscale ? "#64748b" : "#94a3b8"} opacity="0.5" />
            <path d="M 172,0 L 176,16 L 190,16 L 186,0 Z" fill={invertGrayscale ? "#64748b" : "#94a3b8"} opacity="0.5" />
            <path d="M 198,0 L 202,18 L 216,18 L 212,0 Z" fill={invertGrayscale ? "#64748b" : "#94a3b8"} opacity="0.5" />
            <path d="M 224,0 L 226,20 L 238,20 L 234,0 Z" fill={invertGrayscale ? "#64748b" : "#94a3b8"} opacity="0.5" />

            {/* Hairline Fracture Line on Distal Radial Metaphysis */}
            <g>
              <path 
                d="M 130,118 Q 152,112 178,116 T 205,122" 
                stroke="#ef4444" 
                strokeWidth="2.2" 
                fill="none" 
                filter="url(#fractureLineGlow)" 
                strokeDasharray="4 1"
              />
              {/* Cortical step-off tick */}
              <line x1="126" y1="117" x2="132" y2="123" stroke="#f97316" strokeWidth="2.5" />
            </g>

            {/* AI Bounding Box & Target Overlay */}
            {showAiOverlay && (
              <g id="ai-bounding-box-group">
                {/* Glowing Coral/Amber Bounding Box */}
                <rect
                  x="118"
                  y="92"
                  width="96"
                  height="46"
                  rx="6"
                  fill="rgba(245, 158, 11, 0.12)"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  filter="url(#amberGlow)"
                  className="animate-pulse"
                />

                {/* Corner reticles */}
                <path d="M 118,102 L 118,92 L 128,92" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
                <path d="M 204,92 L 214,92 L 214,102" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
                <path d="M 118,128 L 118,138 L 128,138" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
                <path d="M 204,138 L 214,138 L 214,128" stroke="#fbbf24" strokeWidth="2.5" fill="none" />

                {/* Center Landmark Point */}
                <circle cx="166" cy="115" r="3" fill="#f59e0b" />
                <circle cx="166" cy="115" r="7" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" fill="none" />

                {/* Floating AI Callout Pill */}
                <foreignObject x="90" y="60" width="220" height="30">
                  <div className="flex items-center justify-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-[0_2px_10px_rgba(245,158,11,0.6)] border border-amber-300 tracking-tight whitespace-nowrap flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      AI DETECT: {loc.confidence}%
                    </span>
                  </div>
                </foreignObject>
              </g>
            )}

            {/* LSB Watermark Inspection Layer */}
            {inspectLsbWatermark && (
              <g id="lsb-watermark-overlay" className="animate-in fade-in duration-200">
                <rect x="0" y="0" width="400" height="300" fill="url(#lsbPattern)" />
                <rect x="15" y="255" width="200" height="30" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" strokeWidth="1" />
                <text x="25" y="274" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  LSB: {scan.watermarkHash.slice(0, 18)}...
                </text>
              </g>
            )}

            {/* Cryptographic Tamper Breach Pixel Visualization */}
            {isBreached && (
              <g id="tamper-breach-indicator" className="animate-bounce">
                <circle 
                  cx={tamperCoords.x} 
                  cy={tamperCoords.y} 
                  r="14" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 2"
                />
                <circle 
                  cx={tamperCoords.x} 
                  cy={tamperCoords.y} 
                  r="4" 
                  fill="#f43f5e" 
                />
                <line 
                  x1={tamperCoords.x} 
                  y1={tamperCoords.y - 20} 
                  x2={tamperCoords.x} 
                  y2={tamperCoords.y + 20} 
                  stroke="#f43f5e" 
                  strokeWidth="1.5" 
                />
                <line 
                  x1={tamperCoords.x - 20} 
                  y1={tamperCoords.y} 
                  x2={tamperCoords.x + 20} 
                  y2={tamperCoords.y} 
                  stroke="#f43f5e" 
                  strokeWidth="1.5" 
                />
                <rect x={tamperCoords.x - 60} y={tamperCoords.y - 38} width="120" height="18" rx="4" fill="#e11d48" />
                <text x={tamperCoords.x} y={tamperCoords.y - 25} fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  TAMPERED BIT: LSB-FLIP
                </text>
              </g>
            )}

            {/* Radiologist Calibration scale */}
            <g opacity="0.4">
              <line x1="20" y1="20" x2="20" y2="70" stroke={invertGrayscale ? "#000" : "#fff"} strokeWidth="1" />
              <line x1="16" y1="20" x2="24" y2="20" stroke={invertGrayscale ? "#000" : "#fff"} strokeWidth="1" />
              <line x1="16" y1="45" x2="22" y2="45" stroke={invertGrayscale ? "#000" : "#fff"} strokeWidth="1" />
              <line x1="16" y1="70" x2="24" y2="70" stroke={invertGrayscale ? "#000" : "#fff"} strokeWidth="1" />
              <text x="26" y="48" fill={invertGrayscale ? "#000" : "#fff"} fontSize="7" fontFamily="monospace">50mm</text>
            </g>
          </svg>
        )}
        </div>

        {/* Floating Radiograph Zoom Controls in corner */}
        <div className="absolute top-2 right-2 flex items-center gap-1 p-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              className="px-1.5 text-[9px] font-mono text-amber-400 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Bottom Banner on Canvas */}
        <div className="absolute bottom-2 inset-x-2 px-2.5 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-[11px] text-white/90">
          <span className="font-semibold tracking-wide text-amber-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            [AI DETECT: {loc.label} — {loc.confidence}% Confidence]
          </span>
          <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
            Δ {loc.displacementMm}mm Step-off
          </span>
        </div>
      </div>

      {/* Floating Tactical Controls for Radiograph */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Toggle AI Overlay */}
        <button
          id="btn-toggle-ai-overlay"
          onClick={() => setShowAiOverlay(!showAiOverlay)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all glass-pill active:scale-95 ${
            showAiOverlay
              ? 'bg-amber-500/20 dark:bg-amber-500/25 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-600/70 font-semibold ring-1 ring-amber-400/40'
              : 'text-slate-600 dark:text-slate-300 hover:dark:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Toggle AI Overlay</span>
          {showAiOverlay && <Check className="w-3 h-3 text-amber-700 dark:text-amber-300 ml-0.5" />}
        </button>

        {/* Invert Grayscale */}
        <button
          id="btn-invert-grayscale"
          onClick={() => setInvertGrayscale(!invertGrayscale)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all glass-pill active:scale-95 ${
            invertGrayscale
              ? 'bg-sky-500/20 dark:bg-sky-500/25 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-600/70 font-semibold ring-1 ring-sky-400/40'
              : 'text-slate-600 dark:text-slate-300 hover:dark:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Invert Grayscale</span>
        </button>

        {/* Inspect LSB Watermark */}
        <button
          id="btn-inspect-lsb"
          onClick={() => setInspectLsbWatermark(!inspectLsbWatermark)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all glass-pill active:scale-95 ${
            inspectLsbWatermark
              ? 'bg-emerald-500/20 dark:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/70 font-semibold ring-1 ring-emerald-400/40'
              : 'text-slate-600 dark:text-slate-300 hover:dark:text-white'
          }`}
        >
          <Binary className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Inspect LSB Watermark</span>
        </button>

        {onOpenUploadScan && (
          <button
            onClick={onOpenUploadScan}
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all glass-pill bg-amber-500/15 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border-amber-300/80 dark:border-amber-500/40 active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Upload / Replace Image</span>
          </button>
        )}
      </div>
    </div>
  );
};
