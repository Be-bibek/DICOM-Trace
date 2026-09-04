import React, { useState } from 'react';
import { 
  FileText, 
  Stethoscope, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  AlertCircle,
  Scissors,
  BookmarkPlus,
  Share2
} from 'lucide-react';
import type { DicomScan } from '../types';

interface AiClinicalReportCardProps {
  scan: DicomScan;
  isBreached: boolean;
}

export const AiClinicalReportCard: React.FC<AiClinicalReportCardProps> = ({
  scan,
  isBreached
}) => {
  const [copied, setCopied] = useState(false);
  const loc = scan.localization;

  const handleCopyReport = () => {
    navigator.clipboard?.writeText(
      `SentinelMark Clinical Report [Scan #${scan.scanId}]\nSummary: ${scan.reportSummary}\nTriage: ${scan.recommendedTriage}\nConfidence: ${loc.confidence}%`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="structured-ai-clinical-report-card"
      className="p-5 neumo-card flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sky-500/15 dark:bg-sky-500/20 border border-sky-400/40 dark:border-sky-400/30 flex items-center justify-center text-sky-700 dark:text-sky-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Clinical Evaluation</h3>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Structured AI Diagnostic Report</h4>
          </div>
        </div>

        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 neumo-btn"
          title="Copy report to clinical clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 text-slate-400" />
              <span>Export</span>
            </>
          )}
        </button>
      </div>

      {/* Main Medical Summary Callout */}
      <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
          <Stethoscope className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Findings & Morphology
        </p>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {isBreached ? (
            <span className="text-rose-700 dark:text-rose-400 font-medium">
              [WARNING: Scan bitstream integrity compromised. Findings unverified due to cryptographic pairing mismatch.]
            </span>
          ) : (
            scan.reportSummary
          )}
        </p>
      </div>

      {/* Recommended Triage Banner */}
      <div className="mt-4 p-4 neumo-inset flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 tracking-wider">
              Recommended Clinical Triage
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {scan.recommendedTriage}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/70">
          Priority-1
        </span>
      </div>

      {/* Radiographic Measurements Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center">
        <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/80">
          <p className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500">Radial Height</p>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">9.5 mm</p>
          <span className="text-[9px] text-amber-700 dark:text-amber-400">Norm: 11-12</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/80">
          <p className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500">Volar Tilt</p>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">-4° (Dorsal)</p>
          <span className="text-[9px] text-rose-600 dark:text-rose-400">Retroverted</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/80">
          <p className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500">Inclination</p>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">17.2°</p>
          <span className="text-[9px] text-amber-700 dark:text-amber-400">Norm: 22°</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/80">
          <p className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500">Displacement</p>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">{loc.displacementMm} mm</p>
          <span className="text-[9px] text-slate-500 dark:text-slate-400">Cortical step</span>
        </div>
      </div>

      {/* Groth16 Proof Stamp */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          R1CS Circuit: 119,482 verified constraints
        </span>
        <span className="text-slate-400 dark:text-slate-500">Witness: w[0x98f]</span>
      </div>
    </div>
  );
};
