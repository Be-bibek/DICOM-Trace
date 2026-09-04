import React from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Terminal, 
  Flame, 
  CheckCircle2, 
  AlertOctagon,
  KeyRound
} from 'lucide-react';

interface AttackSimulationBannerProps {
  isBreached: boolean;
  onTriggerAttack: () => void;
  onRestoreIntegrity: () => void;
}

export const AttackSimulationBanner: React.FC<AttackSimulationBannerProps> = ({
  isBreached,
  onTriggerAttack,
  onRestoreIntegrity
}) => {
  return (
    <div id="attack-simulation-card" className="w-full flex flex-col gap-2.5">
      {/* Simulation Button Pill */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl milk-card border border-white/80 dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex items-center gap-2 pl-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isBreached ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'}`}>
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white">Zero-Trust Adversary Test</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Inject subtle 1-bit steganographic forgery</p>
          </div>
        </div>

        {!isBreached ? (
          <button
            id="btn-simulate-attack"
            onClick={onTriggerAttack}
            className="px-3.5 py-2 rounded-full text-xs font-semibold tracking-tight text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-[0_4px_14px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-95 flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate 1-Bit Tamper Attack</span>
          </button>
        ) : (
          <button
            id="btn-restore-integrity"
            onClick={onRestoreIntegrity}
            className="px-3.5 py-2 rounded-full text-xs font-semibold tracking-tight text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-[0_4px_14px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Integrity</span>
          </button>
        )}
      </div>

      {/* Red Glass Alert Banner (Triggered upon attack) */}
      {isBreached && (
        <div 
          id="cryptographic-breach-alert"
          role="alert"
          className="p-4 rounded-3xl bg-rose-500/15 dark:bg-rose-950/40 backdrop-blur-2xl border-2 border-rose-500/80 dark:border-rose-600/80 shadow-[0_16px_36px_rgba(244,63,94,0.25),inset_0_1px_2px_rgba(255,255,255,0.8)] animate-in fade-in slide-in-from-top-2 duration-300 relative overflow-hidden"
        >
          {/* Pulsing hazard glow */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-rose-500/20 dark:bg-rose-500/10 blur-xl pointer-events-none" />

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200 tracking-tight flex items-center gap-1.5">
                  <span>Cryptographic Breach: Groth16 Pairing Rejected</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                  CODE: ZK_ERR_PAIRING_MISMATCH
                </span>
              </div>

              <p className="text-xs text-rose-900/90 dark:text-rose-200/90 mt-1 leading-relaxed">
                Hardware Enclave detected a <strong>1-bit LSB alteration</strong> at coordinate <code>(x:142, y:288)</code>. The bilinear Weil pairing evaluation failed to satisfy constraint equations:
              </p>

              <div className="mt-2 p-2 rounded-xl bg-slate-950/85 backdrop-blur-md text-emerald-400 font-mono text-[10px] leading-relaxed border border-white/10 overflow-x-auto">
                <div className="text-rose-400">✖ e(A, B) ≠ e(α, β) · e(C, γ) · e(K, δ)</div>
                <div className="text-slate-400 mt-0.5">Polynomial R1CS evaluation discrepancy detected in witness vector w[4821].</div>
                <div className="text-amber-400 mt-0.5">DICOM pixels quarantined • Consensus DAG signing locked.</div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-1 border-t border-rose-300/40 dark:border-rose-800/40">
                <span className="text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                  Zero bits of clinical data leaked. Zero-trust barrier holding.
                </span>
                <button
                  onClick={onRestoreIntegrity}
                  className="px-3 py-1 rounded-full text-xs font-bold text-rose-950 dark:text-rose-200 bg-white/90 hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-800 border border-rose-300 dark:border-rose-700 shadow-xs hover:shadow transition-all active:scale-95 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-rose-700 dark:text-rose-400" />
                  <span>Re-verify Pristine Scan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
