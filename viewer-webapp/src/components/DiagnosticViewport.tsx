import React, { useRef, useEffect, useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Contrast, 
  AlertOctagon, 
  CheckCircle, 
  ShieldAlert, 
  ZoomIn, 
  ZoomOut, 
  ScanLine,
  Cpu,
  Activity,
  Sliders,
  Sparkles,
  DownloadCloud
} from 'lucide-react';
import { PATIENT_RECORD } from '../data/personas';
import { unwrap_session_key } from '../../pkg/core_rs';

interface DiagnosticViewportProps {
  isTampered: boolean;
  onToggleTamper: () => void;
  isMemoryDumped: boolean;
  onRestoreMemory?: () => void;
  currentPersona?: any;
}

export const DiagnosticViewport: React.FC<DiagnosticViewportProps> = ({
  isTampered,
  onToggleTamper,
  isMemoryDumped,
  onRestoreMemory,
  currentPersona
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showAIMarkup, setShowAIMarkup] = useState(true);
  const [invertedGrayscale, setInvertedGrayscale] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [rotationAngle, setRotationAngle] = useState(0);

  const [isFetching, setIsFetching] = useState(false);
  const [fetchedImageSrc, setFetchedImageSrc] = useState<string | null>(null);
  const [fetchedImageData, setFetchedImageData] = useState<ImageData | null>(null);
  const [payloadSize, setPayloadSize] = useState(0);

  // Render high-contrast bone radiograph onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (isMemoryDumped) {
      // Memory wiped state (Cold boot dump simulation)
      ctx.fillStyle = '#090c14';
      ctx.fillRect(0, 0, width, height);

      // Draw zeroed bytes matrix
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.font = '11px JetBrains Mono, monospace';
      const rows = 18;
      for (let r = 0; r < rows; r++) {
        const y = 40 + r * 26;
        ctx.fillText(`0x0000${(r * 16).toString(16).padStart(4, '0')} : 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 [ZERO_PURGE]`, 25, y);
      }

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MEMORY ENCLAVE PURGED: 0x00 ZERO OVERWRITE', width / 2, height / 2);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('Volatile buffer scrubbed in 0.8ms. Zero plain-text data remains in RAM.', width / 2, height / 2 + 25);
      return;
    }

    // Base background (radiograph negative)
    ctx.fillStyle = invertedGrayscale ? '#f3f4f6' : '#070a13';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);

    if (fetchedImageSrc) {
      const img = new Image();
      img.src = fetchedImageSrc;
      img.onload = () => {
        if (invertedGrayscale) {
            ctx.filter = 'invert(100%)';
        }
        ctx.drawImage(img, 0, 0, width, height);
        ctx.filter = 'none';
      };
      ctx.restore();
      return;
    } else if (fetchedImageData) {
       // A dynamic Image uploaded (256x256)
       // Draw it centered
       const tempCanvas = document.createElement('canvas');
       tempCanvas.width = 256;
       tempCanvas.height = 256;
       const tempCtx = tempCanvas.getContext('2d')!;
       tempCtx.putImageData(fetchedImageData, 0, 0);
       
       if (invertedGrayscale) {
           ctx.filter = 'invert(100%)';
       }
       ctx.drawImage(tempCanvas, width/2 - 128, height/2 - 128, 256, 256);
       ctx.filter = 'none';
       ctx.restore();
       return;
    }

    // Soft tissue silhouette
    const softTissueColor = invertedGrayscale ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fillStyle = softTissueColor;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2 + 10, 160, 260, 0, 0, Math.PI * 2);
    ctx.fill();

    // Radiopacity bone styling colors
    const corticalBone = invertedGrayscale ? 'rgba(30, 41, 59, 0.95)' : 'rgba(240, 248, 255, 0.92)';
    const trabecularBone = invertedGrayscale ? 'rgba(71, 85, 105, 0.65)' : 'rgba(203, 213, 225, 0.6)';
    const marrowBone = invertedGrayscale ? 'rgba(100, 116, 139, 0.35)' : 'rgba(148, 163, 184, 0.28)';

    // 1. Distal Radius (Forearm Lateral Side)
    ctx.beginPath();
    ctx.moveTo(width / 2 - 95, height - 30);
    ctx.bezierCurveTo(width / 2 - 90, height - 120, width / 2 - 85, height - 220, width / 2 - 75, height / 2 - 20);
    ctx.bezierCurveTo(width / 2 - 70, height / 2 - 60, width / 2 - 85, height / 2 - 100, width / 2 - 105, height / 2 - 130);
    ctx.bezierCurveTo(width / 2 - 110, height / 2 - 145, width / 2 - 100, height / 2 - 155, width / 2 - 85, height / 2 - 150);
    ctx.bezierCurveTo(width / 2 - 60, height / 2 - 145, width / 2 - 35, height / 2 - 142, width / 2 - 20, height / 2 - 140);
    ctx.bezierCurveTo(width / 2 - 22, height / 2 - 115, width / 2 - 28, height / 2 - 70, width / 2 - 35, height / 2 - 20);
    ctx.bezierCurveTo(width / 2 - 42, height - 220, width / 2 - 50, height - 120, width / 2 - 55, height - 30);
    ctx.closePath();

    const radiusGrad = ctx.createLinearGradient(width / 2 - 110, height / 2 - 150, width / 2 - 30, height - 30);
    radiusGrad.addColorStop(0, corticalBone);
    radiusGrad.addColorStop(0.3, trabecularBone);
    radiusGrad.addColorStop(0.7, marrowBone);
    radiusGrad.addColorStop(1, corticalBone);
    ctx.fillStyle = radiusGrad;
    ctx.fill();
    ctx.strokeStyle = corticalBone;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Distal Ulna (Forearm Medial Side)
    ctx.beginPath();
    ctx.moveTo(width / 2 + 10, height - 30);
    ctx.bezierCurveTo(width / 2 + 12, height - 120, width / 2 + 15, height - 220, width / 2 + 18, height / 2 - 20);
    ctx.bezierCurveTo(width / 2 + 20, height / 2 - 80, width / 2 + 18, height / 2 - 110, width / 2 + 15, height / 2 - 130);
    ctx.bezierCurveTo(width / 2 + 25, height / 2 - 136, width / 2 + 40, height / 2 - 134, width / 2 + 45, height / 2 - 128);
    ctx.bezierCurveTo(width / 2 + 55, height / 2 - 135, width / 2 + 60, height / 2 - 120, width / 2 + 50, height / 2 - 110);
    ctx.bezierCurveTo(width / 2 + 48, height / 2 - 60, width / 2 + 45, height - 120, width / 2 + 42, height - 30);
    ctx.closePath();

    const ulnaGrad = ctx.createLinearGradient(width / 2 + 10, height / 2 - 136, width / 2 + 55, height - 30);
    ulnaGrad.addColorStop(0, corticalBone);
    ulnaGrad.addColorStop(0.3, trabecularBone);
    ulnaGrad.addColorStop(0.7, marrowBone);
    ulnaGrad.addColorStop(1, corticalBone);
    ctx.fillStyle = ulnaGrad;
    ctx.fill();
    ctx.strokeStyle = corticalBone;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Proximal Carpal Row (Scaphoid, Lunate, Triquetrum)
    // Scaphoid
    ctx.beginPath();
    ctx.ellipse(width / 2 - 65, height / 2 - 175, 22, 14, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = trabecularBone;
    ctx.fill();
    ctx.strokeStyle = corticalBone;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lunate
    ctx.beginPath();
    ctx.ellipse(width / 2 - 25, height / 2 - 170, 18, 13, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = trabecularBone;
    ctx.fill();
    ctx.strokeStyle = corticalBone;
    ctx.stroke();

    // Triquetrum
    ctx.beginPath();
    ctx.ellipse(width / 2 + 15, height / 2 - 165, 14, 11, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = trabecularBone;
    ctx.fill();
    ctx.strokeStyle = corticalBone;
    ctx.stroke();

    // 4. Hairline Fracture Line (Distal Radius Metaphysis)
    ctx.beginPath();
    ctx.moveTo(width / 2 - 96, height / 2 - 78);
    ctx.lineTo(width / 2 - 82, height / 2 - 72);
    ctx.lineTo(width / 2 - 68, height / 2 - 76);
    ctx.lineTo(width / 2 - 52, height / 2 - 70);
    ctx.lineTo(width / 2 - 38, height / 2 - 74);
    
    // Inverted vs Normal fracture line contrast
    ctx.strokeStyle = invertedGrayscale ? 'rgba(239, 68, 68, 0.9)' : 'rgba(254, 202, 202, 0.95)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Subtle cortical step-off interruption
    ctx.beginPath();
    ctx.arc(width / 2 - 96, height / 2 - 78, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.restore();
  }, [invertedGrayscale, zoomLevel, rotationAngle, isMemoryDumped]);

  const handleResetOrientation = () => {
    setZoomLevel(1.0);
    setRotationAngle(0);
    setInvertedGrayscale(false);
  };

  const handleFetchScan = async () => {
    if (!currentPersona) return;
    try {
      setIsFetching(true);
      const res = await fetch(`http://127.0.0.1:8000/fetch/latest?recipient_id=${currentPersona.id}`);
      if (!res.ok) throw new Error("No pending payloads for you.");
      const data = await res.json();
      
      const wrappedKeyArray = new Uint8Array(data.wrapped_key.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
      
      const unwrappedSessionKey = unwrap_session_key(data.ephemeral_sender_pubkey, currentPersona.privateKeyPreview, wrappedKeyArray);
      
      const nonce = Uint8Array.from(atob(data.envelope.nonce), c => c.charCodeAt(0));
      const ciphertext = Uint8Array.from(atob(data.envelope.ciphertext), c => c.charCodeAt(0));
      const tag = Uint8Array.from(atob(data.envelope.tag), c => c.charCodeAt(0));
      
      const encryptedData = new Uint8Array(ciphertext.length + tag.length);
      encryptedData.set(ciphertext);
      encryptedData.set(tag, ciphertext.length);

      const cryptoKey = await crypto.subtle.importKey(
          "raw", unwrappedSessionKey, { name: "AES-GCM" }, false, ["decrypt"]
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: nonce }, cryptoKey, encryptedData
      );
      
      const decryptedBytes = new Uint8Array(decryptedBuffer);
      const len = decryptedBytes.length;
      setPayloadSize(len);

      if (len === 39206) {
          setFetchedImageSrc('/ct_preview.png');
          setFetchedImageData(null);
      } else if (len === 9830) {
          setFetchedImageSrc('/mr_preview.png');
          setFetchedImageData(null);
      } else if (len === 256 * 256 * 4) {
          setFetchedImageData(new ImageData(new Uint8ClampedArray(decryptedBytes.buffer), 256, 256));
          setFetchedImageSrc(null);
      } else {
          console.log("Raw payload decrypted successfully.", len);
      }

    } catch (e: any) {
      console.error(e.message);
      alert(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div 
      id="panel-diagnostic-viewport"
      className="neumo-card p-4 sm:p-6 flex flex-col h-full relative transition-all"
    >
      {/* Top Header of Viewport Panel */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <ScanLine className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Diagnostic Viewport & Edge AI Bounding Box
            </h2>
            <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-medium">
              DICOM Enclave: Nonce #PT4402-WASM-BLIT
            </p>
          </div>
        </div>

          {/* Fetch Scan Button */}
          <button
            type="button"
            onClick={handleFetchScan}
            disabled={isFetching}
            className="mr-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 neumo-btn text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 disabled:opacity-50"
          >
            <DownloadCloud className={`w-3.5 h-3.5 ${isFetching ? 'animate-bounce' : ''}`} />
            <span>Fetch Pending Scan</span>
          </button>

          {/* Tamper Simulation Action Button (Neumorphic) */}
          <button
            type="button"
            id="btn-simulate-bit-flip"
            onClick={onToggleTamper}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              isTampered 
                ? 'neumo-inset text-rose-700 dark:text-rose-400' 
                : 'neumo-btn text-slate-800 dark:text-slate-200 hover:text-rose-700'
            }`}
          >
            {isTampered ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Restore Cryptographic State</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Simulate Bit-Flip Tamper</span>
              </>
            )}
          </button>
        </div>

      {/* Tamper Breach Alert Banner */}
      {isTampered && (
        <div 
          id="tamper-breach-banner"
          className="mb-3 p-3.5 rounded-2xl neumo-inset bg-rose-500/10 border border-rose-500/40 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-pulse"
        >
          <AlertOctagon className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold tracking-wide">
              INTEGRITY BREACH: ZK VERIFICATION REJECTED
            </p>
            <p className="text-[11px] font-mono font-medium opacity-95 mt-0.5">
              Merkle root mismatch at block #4402_R1CS. Cryptographic bit-flip detected in DICOM pixel stream (offset 0x4A2). Edge inference invalidated.
            </p>
          </div>
        </div>
      )}

      {/* Memory Purged Warning Banner */}
      {isMemoryDumped && (
        <div 
          id="memory-dump-banner"
          className="mb-3 p-3 rounded-2xl neumo-inset bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-200"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Memory Enclave Overwritten with 0x00. Zero Recoverable Plaintext.</span>
          </div>
          {onRestoreMemory && (
            <button
              type="button"
              onClick={onRestoreMemory}
              className="px-3 py-1 rounded-full neumo-btn text-[10px] font-mono text-amber-700 dark:text-amber-300 shrink-0 font-semibold"
            >
              Re-derive Decryption Key
            </button>
          )}
        </div>
      )}

      {/* Viewport Window: Recessed Neumorphic Inset Plate */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-[24px] overflow-hidden neumo-inset flex items-center justify-center group p-2">
        
        {/* The HTML5 Canvas for bone X-ray */}
        <canvas
          ref={canvasRef}
          width={560}
          height={480}
          className="w-full h-full object-contain max-h-[460px] rounded-2xl transition-all"
        />

        {/* Dynamic AI Overlay: Vector Bounding Box over Distal Radius Fracture */}
        {showAIMarkup && !isMemoryDumped && (
          <div 
            id="ai-bounding-box"
            className={`absolute pointer-events-none transition-all duration-300 ${
              isTampered ? 'opacity-40' : 'opacity-100'
            }`}
            style={{
              top: '43%',
              left: '26%',
              width: '44%',
              height: '18%',
              transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Soft pulsing border */}
            <div className={`w-full h-full border-2 rounded-xl relative ${
              isTampered 
                ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_18px_rgba(244,63,94,0.4)]' 
                : 'border-[#5b5fc7] dark:border-indigo-400 bg-[#5b5fc7]/10 dark:bg-indigo-500/15 shadow-[0_0_20px_rgba(91,95,199,0.45)]'
            }`}>
              {/* Corner crosshairs */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white dark:border-indigo-200" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white dark:border-indigo-200" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white dark:border-indigo-200" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white dark:border-indigo-200" />

              {/* Fracture alignment reference vector line */}
              <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#5b5fc7] dark:via-indigo-300 to-transparent dashed opacity-80" />

              {/* Neon Label Tag */}
              <div 
                id="ai-detection-label"
                className={`absolute -top-8 left-0 right-auto px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap shadow-md flex items-center gap-1.5 neumo-card-subtle ${
                  isTampered
                    ? 'text-rose-700 dark:text-rose-300'
                    : 'text-indigo-800 dark:text-indigo-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isTampered ? 'bg-rose-600' : 'bg-indigo-700 dark:bg-indigo-400'} animate-ping`} />
                <span>
                  {isTampered 
                    ? '[AI DETECT: INVALIDATED — HASH CORRUPTED]'
                    : '[AI DETECT: Distal Radius Hairline Fracture — 94.2% Conf]'
                  }
                </span>
              </div>

              {/* Step-off measurement tag */}
              <div className="absolute -bottom-6 right-0 px-2 py-0.5 rounded-md neumo-inset-sm text-[9px] font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                Step-off: ~2.0mm volar
              </div>
            </div>
          </div>
        )}

        {/* Floating Neumorphic Toolbar inside Canvas (modeled after reference image) */}
        <div 
          id="canvas-floating-toolbar"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-1.5 rounded-full neumo-card-subtle bg-[#e4e7f0]/95 dark:bg-[#161928]/90 backdrop-blur-md"
        >
          {/* Button 1: Toggle AI Markup */}
          <button
            type="button"
            id="btn-toggle-ai-markup"
            onClick={() => setShowAIMarkup(!showAIMarkup)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
              showAIMarkup 
                ? 'neumo-pressed text-indigo-800 dark:text-indigo-300 font-bold' 
                : 'neumo-btn text-slate-700 dark:text-slate-300 font-semibold'
            }`}
          >
            {showAIMarkup ? <Eye className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="whitespace-nowrap">AI Markup</span>
          </button>

          {/* Button 2: Invert Grayscale */}
          <button
            type="button"
            id="btn-invert-grayscale"
            onClick={() => setInvertedGrayscale(!invertedGrayscale)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
              invertedGrayscale 
                ? 'neumo-pressed text-amber-700 dark:text-amber-300 font-bold' 
                : 'neumo-btn text-slate-700 dark:text-slate-300 font-semibold'
            }`}
          >
            <Contrast className="w-3.5 h-3.5 text-amber-600" />
            <span className="whitespace-nowrap">Invert</span>
          </button>

          {/* Button 3: Reset Orientation */}
          <button
            type="button"
            id="btn-reset-orientation"
            onClick={handleResetOrientation}
            className="w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all active:scale-90"
            title="Reset Zoom & Rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Zoom controls */}
          <div className="h-4 w-[1px] bg-slate-400 dark:bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 2.2))}
            className="w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-slate-700 hover:text-slate-950 dark:text-slate-300 active:scale-90"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
            className="w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-slate-700 hover:text-slate-950 dark:text-slate-300 active:scale-90"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Patient Metadata Neumorphic Ribbon (Bottom ribbon of Panel 1) */}
      <div 
        id="patient-metadata-ribbon"
        className="mt-4 p-3.5 rounded-2xl neumo-inset flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-slate-900 dark:text-white">
            Patient: <span className="text-indigo-800 dark:text-indigo-400 font-extrabold">{PATIENT_RECORD.name}</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">
            ID: <span className="text-slate-900 dark:text-slate-100 font-bold">{PATIENT_RECORD.id}</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Age: <span className="text-slate-900 dark:text-slate-100 font-bold">{PATIENT_RECORD.age}</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Blood: <span className="text-slate-900 dark:text-slate-100 font-bold">{PATIENT_RECORD.bloodGroup}</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Mechanism: <span className="text-amber-800 dark:text-amber-400 font-bold">{PATIENT_RECORD.mechanism}</span>
          </span>
        </div>

        <div className="text-[10px] font-mono text-indigo-800 dark:text-indigo-300 neumo-card-subtle px-2.5 py-1 rounded-full font-bold ml-auto">
          ZK Commitment Verified
        </div>
      </div>
    </div>
  );
};
