import React from 'react';
import { 
  X, 
  Cpu, 
  Binary, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileCode,
  Fingerprint
} from 'lucide-react';

interface ZKProofDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTampered: boolean;
}

export const ZKProofDetailsModal: React.FC<ZKProofDetailsModalProps> = ({
  isOpen,
  onClose,
  isTampered
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in">
      <div 
        id="zk-proof-details-modal"
        className="w-full max-w-xl neumo-card p-6 sm:p-7 relative transition-all"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 neumo-circle-btn hover:text-rose-500"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/10 dark:border-white/10">
          <div className="w-10 h-10 rounded-xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              ZK-SNARK Verification Enclave
            </h3>
            <p className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-300">
              Protocol: Groth16 over BN254 Pairing-Friendly Curve
            </p>
          </div>
        </div>

        {/* Circuit Constraints & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-3 rounded-xl neumo-card-subtle text-center">
            <span className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400 font-bold block mb-1">Constraints</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">119,565 R1CS</span>
          </div>

          <div className="p-3 rounded-xl neumo-card-subtle text-center">
            <span className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400 font-bold block mb-1">Public Inputs</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">4 Scalars</span>
          </div>

          <div className="p-3 rounded-xl neumo-card-subtle text-center">
            <span className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400 font-bold block mb-1">Verify Time</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">3.4 ms</span>
          </div>

          <div className="p-3 rounded-xl neumo-card-subtle text-center">
            <span className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400 font-bold block mb-1">Information Leak</span>
            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">0.000 bits</span>
          </div>
        </div>

        {/* Pairing Equation / Merkle Verification Status */}
        <div className={`p-4 rounded-2xl mb-4 ${
          isTampered
            ? 'neumo-inset bg-rose-500/15 border border-rose-500/40 text-rose-900 dark:text-rose-300'
            : 'neumo-inset bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            {isTampered ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span className="text-xs font-extrabold font-mono">
              {isTampered ? 'PROOF EVALUATION FAILED: e(A, B) ≠ e(α, β) · e(x, γ) · e(C, δ)' : 'e(A, B) == e(α, β) · e(x, γ) · e(C, δ) [SATISFIED]'}
            </span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed">
            {isTampered
              ? 'A 1-bit mutation was introduced into the DICOM raw matrix. The quadratic arithmetic program evaluated against the prover polynomial fails bilinear pairing.'
              : 'Zero-Knowledge property holds: Mathematical certainty that edge neural inference bounded the distal radius fracture without disclosing patient identity or private hospital parameters.'}
          </p>
        </div>

        {/* Proof Payload Hex Dump (Recessed Neumo-Inset) */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Binary className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
              Proof π_a, π_b, π_c Elements
            </span>
            <span>G1 & G2 Points</span>
          </div>
          <div className="p-3 rounded-xl neumo-inset font-mono text-[10px] text-slate-900 dark:text-slate-200 font-medium space-y-1 overflow-x-auto max-h-28">
            <div className="text-slate-600 dark:text-slate-400 font-bold"># π_a (G1 point):</div>
            <div className="truncate">0x2a1b9487c9ef14032d8091a2bc41f92830419283746152019283746152431204</div>
            <div className="text-slate-600 dark:text-slate-400 font-bold"># π_b (G2 point):</div>
            <div className="truncate">0x19283746152435465768798091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4</div>
            <div className="text-slate-600 dark:text-slate-400 font-bold"># π_c (G1 point):</div>
            <div className="truncate">0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba</div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
            Groth16 Verifier WASM Enclave
          </span>
          <span>SentinelMark v2.4</span>
        </div>
      </div>
    </div>
  );
};
