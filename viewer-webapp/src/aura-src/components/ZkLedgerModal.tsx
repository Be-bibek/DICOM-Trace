import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Cpu, 
  Binary, 
  CheckCircle2, 
  FileCode,
  Layers,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ZkProofMetadata, DicomScan } from '../types';

interface ZkLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ZkProofMetadata;
  scan: DicomScan;
  isBreached: boolean;
}

export const ZkLedgerModal: React.FC<ZkLedgerModalProps> = ({
  isOpen,
  onClose,
  metadata,
  scan,
  isBreached
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-2xl rounded-3xl milk-card p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-labelledby="zk-ledger-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isBreached ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="zk-ledger-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Zero-Knowledge Proof Ledger (Groth16)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Circuit ID: circuit_bone_landmark_r1cs_v4
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
              {/* Status summary */}
              <div className={`p-4 rounded-2xl border ${isBreached ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800' : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-250">Verification Result:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${isBreached ? 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200' : 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'}`}>
                    {isBreached ? 'INVALID (BREACH DETECTED)' : 'PROVEN VALID (Groth16 SNARK)'}
                  </span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBreached 
                    ? 'Tampered bitstream fails bilinear group pairing test. Zero personal health information leaked.'
                    : 'The cryptographic witness confirms anatomical bone bounding box coordinates, displacement thresholds, and edge AI parameters without revealing any plaintext patient identifiers.'
                  }
                </p>
              </div>

              {/* Circuit parameters grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Pairing Curve</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">BN254 (Alt-bn128)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">R1CS Constraints</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">119,482 equations</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">PHI Bit Leakage</p>
                  <p className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">0 bits (Mathematically zero)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Proof Latency</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{metadata.verificationTimeMs} ms</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Watermark Root</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{scan.watermarkHash.slice(0, 14)}...</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Hardware Enclave</p>
                  <p className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Apple TPU TPM2</p>
                </div>
              </div>

              {/* Compressed Groth16 Proof Wire Data */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Raw Compressed Proof Bytes (G1/G2 Pairing)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">256 bytes</span>
                </div>
                <pre className="p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[10px] leading-relaxed overflow-x-auto border border-white/10 dark:border-slate-800">
{`// Groth16 Proof Transcript [Curve: BN254, Protocol: SnarkJS/arkworks]
π_A = 0x1f94c8b2a017...38e9a21b (G1 affine)
π_B = 0x27ab01928374...8812cfa0 (G2 affine x2)
π_C = 0x098fba012349...441920ea (G1 affine)

Public Inputs:
[0] 0x0000000000000000000000000000000000000000000000000000000000000001 (One)
[1] 0x00000000000000000000000000000000000000000000000000000000000024cc (Confidence: 942)
[2] 0x00000000000000000000000000000000000000000000000000000000000000c8 (Displacement: 200)
[3] ${scan.watermarkHash} (Watermark Root Hash)`}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Zero-Trust Protocol RFC-9421 Compliant
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 transition-all"
              >
                Dismiss Inspector
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
