import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Stethoscope,
  Copy,
  Check
} from 'lucide-react';
import { DicomScan, DagNode } from '../types';

interface ClinicalReportsViewProps {
  scan: DicomScan;
  dagNodes: DagNode[];
  isBreached: boolean;
}

export const ClinicalReportsView: React.FC<ClinicalReportsViewProps> = ({
  scan,
  dagNodes,
  isBreached
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText?.(scan.watermarkHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="clinical-reports-view" className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl milk-card border border-white/80 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Official Clinical Diagnostic & Consensus Report</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically sealed medical record with multi-doctor Ed25519 signatures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyHash}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Hash Copied!' : 'Copy ZK Hash'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white dark:text-slate-950 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200 font-sans">
        {/* Document Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                SENTINELMARK ZERO-TRUST HEALTHCARE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department of Orthopedic Surgery & Musculoskeletal Radiology
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Protocol: Groth16 SNARK • FIPS 140-3 Hardware Verified
            </p>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isBreached 
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800' 
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            }`}>
              {isBreached ? 'INTEGRITY BREACHED' : 'CONSENSUS RATIFIED'}
            </span>
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-2">
              Report ID: RPT-2026-94821-FINAL
            </p>
          </div>
        </div>

        {/* Patient Demographics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Patient Full Name</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{scan.patient.name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Age / Gender / Blood</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {scan.patient.age} yrs • {scan.patient.gender} • {scan.patient.bloodGroup}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Accession Number</p>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{scan.accessionNumber}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Study Modality</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{scan.modality}</p>
          </div>
        </div>

        {/* Clinical Findings & AI Analysis */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Diagnostic Findings & AI Localization
          </h4>
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-700/50 text-xs space-y-2 text-slate-800 dark:text-slate-200 leading-relaxed">
            <p>
              <strong>Primary Diagnosis:</strong> {scan.localization.label} with {scan.localization.displacementMm}mm cortical displacement and {scan.localization.angulationDegrees}° dorsal tilt.
            </p>
            <p>
              <strong>Edge AI Confidence:</strong> {scan.localization.confidence}% (Evaluated on Apple Neural Engine TPU v2).
            </p>
            <p>
              <strong>Carpal Alignment:</strong> {scan.localization.scaphoidInvolved ? 'Scaphoid cortical breach suspected.' : 'Normal carpal arcs maintained. Gilula lines I, II, and III are continuous.'}
            </p>
          </div>
        </div>

        {/* Surgical Triage Recommendation */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Recommended Clinical Management Plan
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            {scan.recommendedTriage}
          </p>
        </div>

        {/* Multi-Doctor Signing Ledger */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Multi-Doctor Consensus & Ed25519 Cryptographic Signatures
          </h4>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            {dagNodes.map((node) => (
              <div key={node.id} className="p-3.5 bg-white dark:bg-slate-850 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={node.authorAvatar}
                    alt={node.authorName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{node.authorName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{node.authorRole}</p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 italic mt-0.5">"{node.clinicalNote}"</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                    {node.decision.toUpperCase()}
                  </span>
                  <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1">{node.signatureEd25519.slice(0, 16)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watermark Root Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span>Groth16 Root: {scan.watermarkHash}</span>
          <span>Zero-Trust Protocol RFC-9421 Compliant</span>
        </div>
      </div>
    </div>
  );
};
