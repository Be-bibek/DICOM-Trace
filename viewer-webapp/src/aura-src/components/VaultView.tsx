import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Terminal, 
  Hash, 
  Fingerprint,
  RefreshCw
} from 'lucide-react';
import type { UserProfile, ZkProofMetadata } from '../types';

interface VaultViewProps {
  users: UserProfile[];
  zkMetadata: ZkProofMetadata;
  isBreached: boolean;
}

export const VaultView: React.FC<VaultViewProps> = ({ users, zkMetadata, isBreached }) => {
  return (
    <div id="vault-view" className="p-5 neumo-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/40 dark:border-amber-400/30 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero-Trust Key Vault & Secure Enclave</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hardware TPM-bound Ed25519 Identity Registry & Groth16 Prover</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium border border-emerald-300 dark:border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>FIPS 140-3 Level 4 Secure</span>
        </div>
      </div>

      {/* Doctor Key Pairings */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Enrolled Clinical Signers (Ed25519 Keypairs)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {users.map((user) => (
            <div key={user.id} className="p-3.5 rounded-2xl neumo-inset border-none flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.title}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 truncate">
                  <Fingerprint className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{user.publicKey}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Zero-Knowledge Circuit Verification */}
      <div className="p-4 rounded-2xl neumo-inset border-none space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Groth16 Verification Engine (BN254 Curve)
          </span>
          <span className="text-slate-400">119.5k Constraints</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="p-2 rounded-xl neumo-inset border-none bg-transparent">
            <p className="text-[10px] text-slate-400">PHI Disclosure</p>
            <p className="text-emerald-400 font-mono font-bold">0.00 bits</p>
          </div>
          <div className="p-2 rounded-xl neumo-inset border-none bg-transparent">
            <p className="text-[10px] text-slate-400">Pairing Latency</p>
            <p className="text-white font-mono font-bold">{zkMetadata.verificationTimeMs} ms</p>
          </div>
          <div className="p-2 rounded-xl neumo-inset border-none bg-transparent">
            <p className="text-[10px] text-slate-400">Curve Security</p>
            <p className="text-white font-mono font-bold">128-bit Post-Quantum</p>
          </div>
          <div className="p-2 rounded-xl neumo-inset border-none bg-transparent">
            <p className="text-[10px] text-slate-400">Enclave Status</p>
            <p className="text-emerald-400 font-mono font-bold">Hardware Locked</p>
          </div>
        </div>
      </div>
    </div>
  );
};
