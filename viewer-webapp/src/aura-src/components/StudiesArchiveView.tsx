import React, { useState } from 'react';
import { 
  FolderArchive, 
  UploadCloud, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight,
  Filter,
  Activity,
  Calendar,
  Layers,
  FileCode
} from 'lucide-react';
import type { DicomScan } from '../types';

interface StudiesArchiveViewProps {
  scans: DicomScan[];
  activeScan: DicomScan;
  onSelectScan: (scan: DicomScan) => void;
  onOpenUpload: () => void;
  onNavigateToScanner: () => void;
  isBreached: boolean;
}

export const StudiesArchiveView: React.FC<StudiesArchiveViewProps> = ({
  scans,
  activeScan,
  onSelectScan,
  onOpenUpload,
  onNavigateToScanner,
  isBreached
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'wrist' | 'hand' | 'knee'>('all');

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.anatomicalRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div id="studies-archive-view" className="space-y-4 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl neumo-card border border-white/80 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>DICOM Studies & Medical Image Archive</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable radiograph records sealed with Groth16 zero-knowledge proofs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search studies or patient..."
              className="pl-8 pr-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white dark:text-slate-950 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
            <span>+ Upload / Replace Scan</span>
          </button>
        </div>
      </div>

      {/* Grid of Medical Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScans.map((scan) => {
          const isActive = scan.scanId === activeScan.scanId;

          return (
            <div
              key={scan.scanId}
              className={`p-5 rounded-3xl neumo-card border transition-all duration-300 flex flex-col justify-between relative group ${
                isActive
                  ? 'border-amber-400/90 ring-2 ring-amber-400/40 bg-white/90 dark:bg-slate-800/95 dark:border-amber-500/80 shadow-md'
                  : 'border-white/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-850/80 hover:bg-white/85 dark:hover:bg-slate-800/90 shadow-xs'
              }`}
            >
              {/* Top Row: Region & Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {scan.modality}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active In Scanner
                    </span>
                  )}
                </div>

                {/* Scan Image Thumbnail Preview */}
                <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 relative flex items-center justify-center">
                  {scan.customImageUrl ? (
                    <img 
                      src={scan.customImageUrl} 
                      alt={scan.anatomicalRegion} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Layers className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-400 font-mono">16-bit Radiograph Study</p>
                    </div>
                  )}

                  {/* Bounding box badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] text-amber-400 font-mono border border-white/10">
                    {scan.localization.confidence}% AI Confidence
                  </div>
                </div>

                {/* Patient & Finding Details */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {scan.patient.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {scan.anatomicalRegion}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {scan.reportSummary}
                </p>
              </div>

              {/* Card Footer: Hash & Action */}
              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 font-mono">Watermark SHA-256</p>
                  <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate">{scan.watermarkHash.slice(0, 14)}...</p>
                </div>

                <button
                  onClick={() => {
                    onSelectScan(scan);
                    onNavigateToScanner();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100'
                      : 'bg-white hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
