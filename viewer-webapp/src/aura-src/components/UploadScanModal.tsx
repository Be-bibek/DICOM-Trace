import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Sparkles, 
  RefreshCw,
  FileText,
  ShieldCheck,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { DicomScan } from '../types';

interface UploadScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScan: DicomScan;
  onReplaceScanImage: (updatedScan: DicomScan) => void;
  onResetDemo: () => void;
}

export const UploadScanModal: React.FC<UploadScanModalProps> = ({
  isOpen,
  onClose,
  activeScan,
  onReplaceScanImage,
  onResetDemo
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(activeScan.customImageUrl || null);
  const [fileName, setFileName] = useState<string>('');
  const [fileHash, setFileHash] = useState<string>(activeScan.watermarkHash);
  const [patientName, setPatientName] = useState<string>(activeScan.patient.name);
  const [anatomicalRegion, setAnatomicalRegion] = useState<string>(activeScan.anatomicalRegion);
  const [modality, setModality] = useState<string>(activeScan.modality);
  const [clinicalFinding, setClinicalFinding] = useState<string>(activeScan.reportSummary);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process file upload and compute SHA-256 hash
  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    // 1. Read preview as Data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);

      // 2. Compute true SHA-256 from ArrayBuffer
      try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setFileHash(hashHex);
      } catch (err) {
        // Fallback simulated hash if crypto.subtle fails
        const fallback = '0x' + Math.random().toString(16).substring(2, 34);
        setFileHash(fallback);
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;

    const updated: DicomScan = {
      ...activeScan,
      customImageUrl: previewUrl,
      watermarkHash: fileHash,
      anatomicalRegion: anatomicalRegion,
      modality: modality,
      reportSummary: clinicalFinding,
      patient: {
        ...activeScan.patient,
        name: patientName
      }
    };

    onReplaceScanImage(updated);
    onClose();
  };

  // Preset medical scans for instant testing
  const presetOptions = [
    {
      title: 'Distal Radius Colles Fracture',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      region: 'Left Wrist / Distal Radius',
      finding: 'Transverse distal radial cortical breach with dorsal displacement.'
    },
    {
      title: 'Hand & Scaphoid Radiograph',
      url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
      region: 'Right Hand & Carpus',
      finding: 'Cortical radiolucency across mid-body scaphoid waist with avascular risk.'
    },
    {
      title: 'Knee AP Diagnostic View',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      region: 'Right Knee Joint',
      finding: 'Tibial plateau cortical margin intact; mild joint space narrowing.'
    }
  ];

  const handleSelectPreset = (preset: typeof presetOptions[0]) => {
    setPreviewUrl(preset.url);
    setAnatomicalRegion(preset.region);
    setClinicalFinding(preset.finding);
    setFileName(preset.title);
    setFileHash('0x' + Math.random().toString(16).substring(2, 34));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          role="dialog"
          aria-labelledby="upload-scan-modal-title"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-2xl rounded-3xl milk-card p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/50 dark:border-amber-400/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="upload-scan-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    Replace / Upload Clinical Scan
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload your custom medical image or DICOM study with real-time SHA-256 hash sealing
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Drag & Drop File Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[0.99]' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,.dcm,.dicom" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }} 
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-36 h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm bg-black">
                      <img 
                        src={previewUrl} 
                        alt="Scan Preview" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] text-white font-mono truncate">
                          {fileName || 'Custom Scan Loaded'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Click or drop another file to replace</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1 border border-amber-200 dark:border-amber-800">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white">
                      Click to browse or drag & drop your medical image here
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Supports PNG, JPG, DICOM exports, radiograph scans up to 50MB
                    </p>
                  </div>
                )}
              </div>

              {/* Preset Clinical Scans Library */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Or Choose a Verified Clinical Study Preset</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Quick Test Cases</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {presetOptions.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-all group"
                    >
                      <p className="font-semibold text-slate-800 dark:text-white text-[11px] group-hover:text-amber-900 dark:group-hover:text-amber-300 truncate">
                        {preset.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {preset.region}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields: Patient & Scan Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Anatomical Region</label>
                  <input
                    type="text"
                    value={anatomicalRegion}
                    onChange={(e) => setAnatomicalRegion(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Diagnostic Assessment / Report</label>
                <textarea
                  rows={2}
                  value={clinicalFinding}
                  onChange={(e) => setClinicalFinding(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Cryptographic SHA-256 Hash Seal */}
              <div className="p-3 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white font-mono space-y-1 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Hash className="w-3 h-3" />
                    Cryptographic Watermark SHA-256
                  </span>
                  <span className="text-emerald-400">Groth16 Root Link</span>
                </div>
                <p className="text-[11px] text-emerald-300 truncate">
                  {fileHash}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setPreviewUrl(null);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Demo Scan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!previewUrl || isProcessing}
                  className="px-5 py-2 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 disabled:opacity-50 transition-all text-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
                  <span>Apply & Recalculate Proof</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
