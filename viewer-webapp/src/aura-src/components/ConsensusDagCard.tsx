import React, { useState } from 'react';
import { 
  GitFork, 
  Check, 
  AlertTriangle, 
  X, 
  PenTool, 
  ShieldCheck, 
  Hash, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowDown, 
  UserCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import type { DagNode, UserProfile, ConsensusDecision } from '../types';

interface ConsensusDagCardProps {
  nodes: DagNode[];
  currentUser: UserProfile;
  onSignNode: (decision: ConsensusDecision, comment: string) => void;
  isBreached: boolean;
}

export const ConsensusDagCard: React.FC<ConsensusDagCardProps> = ({
  nodes,
  currentUser,
  onSignNode,
  isBreached
}) => {
  const [selectedDecision, setSelectedDecision] = useState<ConsensusDecision>('accept');
  const [clinicalComment, setClinicalComment] = useState<string>('');
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const isPatient = currentUser.role === 'patient';

  // Preset medical commentary pills
  const presets = [
    'Volar plate fixation indicated',
    'Cast immobilization sufficient',
    'Request 3D CT reconstruction',
    'Follow up in 10 days'
  ];

  const handleSignAndCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalComment.trim()) return;

    setIsSigning(true);
    setTimeout(() => {
      onSignNode(selectedDecision, clinicalComment);
      setClinicalComment('');
      setIsSigning(false);
    }, 450);
  };

  // Check consensus stats
  const totalDoctors = nodes.filter(n => !n.isGenesis).length;
  const acceptedCount = nodes.filter(n => !n.isGenesis && n.decision === 'accept').length;

  return (
    <div 
      id="consensus-dag-card"
      className="p-4 milk-card flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-400/40 dark:border-emerald-400/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Zero-Trust Ledger</h3>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Multi-Doctor Consensus DAG</h4>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-1">
          <Hash className="w-3 h-3 text-slate-400" />
          Chain Depth: {nodes.length}
        </span>
      </div>

      {/* Chained Clinical Notes Thread (Interactive DAG) */}
      <div className="flex-1 max-h-[380px] overflow-y-auto pr-1 space-y-3 mb-3">
        {nodes.map((node, index) => {
          const isLatest = index === nodes.length - 1;
          return (
            <div key={node.id} className="relative group">
              {/* Vertical connecting line to next node */}
              {!isLatest && (
                <div className="absolute left-4 top-10 bottom-[-16px] w-[2px] bg-gradient-to-b from-amber-400 via-emerald-400 to-slate-300 dark:to-slate-700 z-0" />
              )}

              <div 
                className={`p-3 rounded-2xl transition-all relative z-10 ${
                  node.isGenesis
                    ? 'bg-slate-900/90 text-white border border-slate-700/80 shadow-md'
                    : 'bg-white/80 dark:bg-slate-800/80 border border-white/95 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Node Author & Decision Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={node.authorAvatar}
                      alt={node.authorName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/60 dark:ring-slate-600 shrink-0"
                    />
                    <div>
                      <p className={`text-xs font-bold leading-tight ${node.isGenesis ? 'text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                        {node.authorName}
                      </p>
                      <p className={`text-[10px] ${node.isGenesis ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'} leading-none`}>
                        {node.authorRole}
                      </p>
                    </div>
                  </div>

                  {/* Decision Tag */}
                  {node.decision === 'accept' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Approved
                    </span>
                  )}
                  {node.decision === 'modify' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      Modified
                    </span>
                  )}
                  {node.decision === 'reject' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 flex items-center gap-1">
                      <X className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      Rejected
                    </span>
                  )}
                </div>

                {/* Node Commentary Text */}
                <p className={`text-xs leading-relaxed ${node.isGenesis ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200'} mb-2`}>
                  "{node.clinicalNote}"
                </p>

                {/* Cryptographic Hashes & Ed25519 Signature */}
                <div className={`pt-1.5 border-t ${node.isGenesis ? 'border-slate-800' : 'border-slate-100 dark:border-slate-700/80'} flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono`}>
                  <div className="flex items-center gap-1">
                    <Lock className={`w-3 h-3 ${node.isGenesis ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className={node.isGenesis ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}>
                      Sig: {node.signatureEd25519.slice(0, 10)}...{node.signatureEd25519.slice(-4)}
                    </span>
                  </div>
                  <span className={node.isGenesis ? 'text-amber-400/90' : 'text-emerald-700 dark:text-emerald-400 font-medium'}>
                    ✓ Signed Ed25519 ({node.timestamp})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Mode: Displays green verified completion badge */}
      {isPatient ? (
        <div 
          id="patient-mode-consensus-badge"
          className="p-4 rounded-2xl bg-emerald-500/15 dark:bg-emerald-950/40 border-2 border-emerald-400/80 dark:border-emerald-800/70 backdrop-blur-xl text-slate-800 dark:text-slate-200 animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">
                  Consensus Finalized: {acceptedCount}/{totalDoctors} Doctors Signed
                </h4>
              </div>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-300/90 mt-1 leading-relaxed">
                Your medical study has undergone cryptographic zero-trust validation. Dr. Rajesh Sharma and Dr. Anita Patel have independently confirmed your treatment plan with zero personal data leakage.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                  Surgical Volar Plating Scheduled
                </span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  Care coordinator contacted
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Doctor Action Panel */
        <div 
          id="active-doctor-action-panel"
          className={`p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs transition-all ${
            isBreached ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Sign as {currentUser.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Key: {currentUser.publicKey.slice(8, 18)}...
            </span>
          </div>

          <form onSubmit={handleSignAndCommit} className="space-y-2.5">
            {/* Decision Pills */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                id="btn-decision-accept"
                onClick={() => setSelectedDecision('accept')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  selectedDecision === 'accept'
                    ? 'bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
                    : 'bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>✓ Accept AI</span>
              </button>

              <button
                type="button"
                id="btn-decision-modify"
                onClick={() => setSelectedDecision('modify')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  selectedDecision === 'modify'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.35)]'
                    : 'bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>⚠ Modify</span>
              </button>

              <button
                type="button"
                id="btn-decision-reject"
                onClick={() => setSelectedDecision('reject')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  selectedDecision === 'reject'
                    ? 'bg-rose-600 text-white shadow-[0_2px_8px_rgba(244,63,94,0.35)]'
                    : 'bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>✕ Reject</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setClinicalComment(preset)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600 transition-all truncate"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Commentary Textarea */}
            <textarea
              id="clinical-commentary-input"
              value={clinicalComment}
              onChange={(e) => setClinicalComment(e.target.value)}
              placeholder="Enter clinical assessment or operative notes to bind to cryptographic hash-chain..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none shadow-inner"
            />

            {/* Action Button: Sign Review & Commit to Hash-Chain */}
            <button
              type="submit"
              id="btn-sign-review-commit"
              disabled={isSigning || !clinicalComment.trim() || isBreached}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-[0_4px_16px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSigning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Ed25519 & Commit...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign Review & Commit to Hash-Chain</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
