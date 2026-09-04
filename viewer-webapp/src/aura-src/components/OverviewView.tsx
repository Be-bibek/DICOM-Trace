import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  Eye, 
  FileText, 
  Search, 
  CreditCard, 
  ChevronRight, 
  Lock, 
  Zap,
  FolderArchive,
  UploadCloud,
  FileCode,
  ScanLine
} from 'lucide-react';
import { motion } from 'motion/react';
import { DicomScan, DagNode, UserProfile } from '../types';

interface OverviewViewProps {
  activeScan: DicomScan;
  availableScans: DicomScan[];
  onSelectScan: (scan: DicomScan) => void;
  onNavigateTab: (tab: 'diagnostics' | 'studies' | 'dag' | 'security' | 'reports') => void;
  onOpenUpload: () => void;
  onOpenZkLedger: () => void;
  onOpenLogin: () => void;
  isBreached: boolean;
  currentUser: UserProfile;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  activeScan,
  availableScans,
  onSelectScan,
  onNavigateTab,
  onOpenUpload,
  onOpenZkLedger,
  onOpenLogin,
  isBreached,
  currentUser
}) => {
  const [tableFilter, setTableFilter] = useState<'all' | 'ortho' | 'radiology' | 'trauma'>('all');
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Table items
  const recentStudies = [
    {
      id: activeScan.accessionNumber,
      patient: activeScan.patient.name,
      modality: activeScan.modality,
      finding: activeScan.localization.label,
      confidence: activeScan.localization.confidence,
      hash: activeScan.watermarkHash.slice(0, 14) + '...',
      status: isBreached ? 'FLAGGED' : 'ZK_VERIFIED',
      time: '12 mins ago'
    },
    {
      id: 'ACC-2026-94822',
      patient: 'Pooja Nair',
      modality: 'Radiography PA',
      finding: 'Scaphoid Waist Fracture',
      confidence: 96.5,
      hash: '0x3c91a082...bf12',
      status: 'ZK_VERIFIED',
      time: '45 mins ago'
    },
    {
      id: 'ACC-2026-94823',
      patient: 'Devendra K.',
      modality: 'CT Volume 3D',
      finding: 'Distal Fibula Transverse',
      confidence: 91.8,
      hash: '0x992fa102...ee31',
      status: 'PENDING_CONSENSUS',
      time: '2 hours ago'
    },
    {
      id: 'ACC-2026-94824',
      patient: 'Meera Sengupta',
      modality: 'Digital X-Ray',
      finding: 'Clavicle Midshaft Displacement',
      confidence: 98.1,
      hash: '0x17fa2b99...a810',
      status: 'ZK_VERIFIED',
      time: '4 hours ago'
    }
  ];

  return (
    <div id="overview-dashboard-view" className="space-y-5">
      {/* Top Banner & Quick Metric Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Virtual Holographic Health Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-5 relative p-6 rounded-3xl milk-card overflow-hidden flex flex-col justify-between border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] group"
        >
          {/* Holographic Iridescent Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/25 via-sky-200/20 to-purple-200/25 dark:from-amber-950/30 dark:via-sky-950/20 dark:to-purple-950/30 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-amber-400/20 dark:from-amber-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Card Top */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-7 rounded-lg bg-amber-400/30 dark:bg-amber-400/20 border border-amber-500/40 dark:border-amber-400/30 flex items-center justify-center shadow-xs">
                {/* Simulated EMV Smart Chip */}
                <div className="w-5 h-4 rounded-sm border border-amber-700/60 dark:border-amber-400/60 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                  <div className="bg-amber-600/50 dark:bg-amber-400/40 rounded-xs" />
                  <div className="bg-amber-600/50 dark:bg-amber-400/40 rounded-xs" />
                  <div className="bg-amber-600/50 dark:bg-amber-400/40 rounded-xs" />
                  <div className="bg-amber-600/50 dark:bg-amber-400/40 rounded-xs" />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                SENTINEL CLINICAL ID
              </span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold">
              Ed25519 Enclave
            </span>
          </div>

          {/* Card Middle: Accession Number & Patient */}
          <div className="relative z-10 my-5">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Active DICOM Study
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tracking-wider mt-0.5">
              {showCardDetails ? activeScan.accessionNumber : `ACC-**** ${activeScan.accessionNumber.slice(-5)}`}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{activeScan.patient.name}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">{activeScan.anatomicalRegion}</span>
            </div>
          </div>

          {/* Card Bottom Controls */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isBreached ? 'Tamper Detected' : 'Cryptographically Verified'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCardDetails(!showCardDetails)}
                className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition-all"
              >
                {showCardDetails ? 'Mask Details' : 'Reveal details'}
              </button>
              <button
                onClick={() => onNavigateTab('diagnostics')}
                className="px-3 py-1 rounded-full text-xs font-bold text-white dark:text-slate-950 bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 shadow-xs flex items-center gap-1 transition-all"
              >
                <span>Inspect Scan</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 3 Executive Stat Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Metric 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="p-5 rounded-3xl milk-card flex flex-col justify-between border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 shadow-xs"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">AI Diagnostic Confidence</p>
              <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
                {activeScan.localization.confidence}%
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+2.4% vs Baseline</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-mono">
              YOLOv8-Medical Edge Engine
            </p>
          </motion.div>

          {/* Metric 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-5 rounded-3xl milk-card flex flex-col justify-between border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 shadow-xs"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Enclave Proof Latency</p>
              <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
                14.2 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">ms</span>
              </p>
              <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1 flex items-center gap-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Ultra-Low Hardware Jitter</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-mono">
              Groth16 BN254 Pairings
            </p>
          </motion.div>

          {/* Metric 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="p-5 rounded-3xl milk-card flex flex-col justify-between border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 shadow-xs"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Zero-Trust PHI Leak</p>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                0.00 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">bits</span>
              </p>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Zero plaintext patient data
              </p>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-mono">
              FIPS 140-3 Level 4 Bound
            </p>
          </motion.div>
        </div>
      </div>

      {/* Middle Section: Consensus Velocity Curve & Department Volumes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Consensus Velocity Multi-Line Chart */}
        <div className="lg:col-span-8 p-5 rounded-3xl milk-card border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Consensus Velocity & Signing Frequency
              </h4>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Multi-Doctor Verification Throughput (Past 7 Days)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              Avg 18 Scans/Hr
            </span>
          </div>

          {/* Smooth SVG Curves */}
          <div className="h-44 w-full relative pt-2">
            <svg viewBox="0 0 700 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curve1Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="curve2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowPoint">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" className="dark:stroke-slate-700" opacity="0.4" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" className="dark:stroke-slate-700" opacity="0.4" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" className="dark:stroke-slate-700" opacity="0.4" />

              {/* Curve 1 Area & Path (Amber: Orthopedics & Trauma) */}
              <path
                d="M 20,130 C 100,120 180,50 260,70 C 340,90 420,30 500,60 C 580,90 640,40 680,25 L 680,160 L 20,160 Z"
                fill="url(#curve1Grad)"
              />
              <path
                d="M 20,130 C 100,120 180,50 260,70 C 340,90 420,30 500,60 C 580,90 640,40 680,25"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Curve 2 Area & Path (Sky: Radiology AI Validations) */}
              <path
                d="M 20,110 C 110,95 190,120 270,100 C 350,80 430,110 510,75 C 590,40 640,70 680,60"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 2"
              />

              {/* Glowing High-value Points */}
              <circle cx="260" cy="70" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" filter="url(#glowPoint)" />
              <circle cx="500" cy="60" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" filter="url(#glowPoint)" />
              <circle cx="680" cy="25" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" filter="url(#glowPoint)" />
            </svg>
          </div>

          {/* Days axis labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 px-2 pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun (Today)</span>
          </div>
        </div>

        {/* Department Volume Bar Chart */}
        <div className="lg:col-span-4 p-5 rounded-3xl milk-card border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Departmental Triage
              </h4>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Past 30 Days</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Study Distribution</p>
          </div>

          {/* Vertical Bar chart */}
          <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { dept: 'Ortho', count: 680, color: 'from-amber-400 to-amber-500', height: '85%' },
              { dept: 'Radio', count: 420, color: 'from-sky-400 to-sky-500', height: '65%' },
              { dept: 'Trauma', count: 310, color: 'from-rose-400 to-rose-500', height: '48%' },
              { dept: 'Neuro', count: 180, color: 'from-emerald-400 to-emerald-500', height: '32%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">{bar.count}</span>
                <div 
                  className={`w-full bg-gradient-to-t ${bar.color} rounded-xl shadow-xs transition-all duration-500`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{bar.dept}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Total Enrolled Specialists</span>
            <span className="font-bold text-slate-900 dark:text-white">14 Verified</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Studies & Consensus Records Table */}
      <div className="p-5 rounded-3xl milk-card border border-white/80 dark:border-slate-800 dark:bg-slate-900/85 space-y-4">
        {/* Table Header & Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Clinical Consensus & Study Registry</h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              4 Studies Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              {(['all', 'ortho', 'radiology', 'trauma'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTableFilter(f)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    tableFilter === f
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All Records' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Upload Scan Action Button */}
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-900 dark:text-amber-950" />
              <span>+ Upload / Replace Scan</span>
            </button>
          </div>
        </div>

        {/* Study Rows Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800">
                <th className="pb-2.5 font-semibold">Accession / Study</th>
                <th className="pb-2.5 font-semibold">Patient Name</th>
                <th className="pb-2.5 font-semibold">Modality</th>
                <th className="pb-2.5 font-semibold">AI Diagnostic Finding</th>
                <th className="pb-2.5 font-semibold">Confidence</th>
                <th className="pb-2.5 font-semibold">Watermark Hash</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800">
              {recentStudies.map((study, idx) => (
                <tr key={idx} className="hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ScanLine className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{study.id}</span>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{study.patient}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{study.modality}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">{study.finding}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono font-bold text-[11px]">
                      {study.confidence}%
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">{study.hash}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigateTab('diagnostics')}
                      className="px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-amber-400 dark:hover:text-slate-950 border border-slate-300 dark:border-slate-700 shadow-2xs transition-all"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
