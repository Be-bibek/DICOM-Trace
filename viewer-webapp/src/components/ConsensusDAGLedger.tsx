import React, { useState } from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Lock,
  FileText
} from 'lucide-react';
import type { DAGNode, Persona, ConsensusDecision } from '../types';

interface ConsensusDAGLedgerProps {
  currentPersona: Persona;
  nodes: DAGNode[];
  onCommitReview: (node: DAGNode) => void;
  isTampered: boolean;
}

export const ConsensusDAGLedger: React.FC<ConsensusDAGLedgerProps> = ({
  currentPersona,
  nodes,
  onCommitReview,
  isTampered
}) => {
  const isPatient = currentPersona.type === 'patient';
  const [decision, setDecision] = useState<ConsensusDecision>('approve');
  const [clinicalNote, setClinicalNote] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSignAndCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNote.trim()) return;

    setIsSigning(true);

    setTimeout(() => {
      const prevBlock = nodes[nodes.length - 1];
      const timeString = new Date().toISOString();

      // Generate simulated SHA-256 Hash and Ed25519 signature
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(prevBlock.hash + decision + clinicalNote + timeString))
        .then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const newHash = "0x" + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Simulated signature
          const randomHexPart = Math.random().toString(16).substring(2, 10);
          const newSignature = `ed25519_sig:${randomHexPart}90bcdae10293847192837461928374610293847`;

          const newNode: DAGNode = {
        id: `node-${Date.now()}`,
        blockNumber: nodes.length,
        authorName: currentPersona.name,
        authorRole: currentPersona.roleTitle,
        authorPublicKey: currentPersona.publicKey,
        timestamp: timeString,
        hash: newHash,
        prevHash: prevBlock.hash,
        signature: newSignature,
        decision: decision,
        clinicalNote: clinicalNote.trim(),
        metrics: {
          confidence: decision === 'approve' ? 99.4 : 91.2,
          radiologicalFeature: 'Reviewer Consensus Affirmed',
          intraArticularStepOff: 'Volar alignment noted'
        }
      };

      onCommitReview(newNode);
      setClinicalNote('');
      setIsSigning(false);
      setSuccessToast(`Block #${newNode.blockNumber} cryptographically committed to DAG`);
      setTimeout(() => setSuccessToast(null), 4000);
      });
    }, 700);
  };

  return (
    <div 
      id="panel-consensus-dag"
      className="neumo-card p-4 sm:p-6 flex flex-col h-full relative transition-all"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Consensus DAG & Chained Review Ledger
            </h2>
            <p className="text-[11px] font-mono text-slate-700 font-medium dark:text-slate-300">
              Immutable Multi-Physician Chain ({nodes.length} Blocks)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full neumo-card-subtle text-[10px] font-mono font-semibold text-slate-800 dark:text-slate-300">
          <Lock className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
          <span>DAG Linked</span>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="mb-3 p-3 rounded-2xl neumo-card-subtle border-l-4 border-l-emerald-500 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Chronological Hash-Chain Thread */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[460px] mb-4">
        {nodes.map((node, index) => {
          const isGenesis = node.isGenesis;
          const isCurrentAuthor = node.authorPublicKey === currentPersona.publicKey;

          return (
            <div 
              key={node.id} 
              id={`dag-block-${node.blockNumber}`}
              className="relative pl-6 group"
            >
              {/* DAG Vertical Line connection */}
              {index < nodes.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-[2px] bg-slate-300 dark:bg-slate-700" />
              )}

              {/* Node Marker Dot */}
              <div className={`absolute left-0.5 top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                isGenesis
                  ? 'bg-[#5b5fc7] border-indigo-200 shadow-sm'
                  : node.decision === 'approve'
                  ? 'bg-emerald-500 border-emerald-200 shadow-sm'
                  : node.decision === 'modify'
                  ? 'bg-amber-500 border-amber-200 shadow-sm'
                  : 'bg-rose-500 border-rose-200 shadow-sm'
              }`} />

              {/* Block Card Container (Soft Clay Card) */}
              <div className={`p-3.5 rounded-2xl neumo-card-subtle transition-all duration-200 ${
                isCurrentAuthor 
                  ? 'border-l-4 border-l-[#5b5fc7] dark:border-l-indigo-400' 
                  : ''
              }`}>
                {/* Block Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {node.authorName}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      ({node.authorRole})
                    </span>
                  </div>

                  {/* Decision Tag Pill */}
                  {isGenesis ? (
                    <span className="px-2 py-0.5 rounded-full neumo-inset-sm text-[10px] font-mono font-bold text-indigo-800 dark:text-indigo-300">
                      GENESIS AI
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full neumo-inset-sm text-[10px] font-mono font-bold flex items-center gap-1 ${
                      node.decision === 'approve'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : node.decision === 'modify'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}>
                      {node.decision === 'approve' && <CheckCircle2 className="w-3 h-3" />}
                      {node.decision === 'modify' && <AlertTriangle className="w-3 h-3" />}
                      {node.decision === 'reject' && <XCircle className="w-3 h-3" />}
                      <span className="uppercase">{node.decision}</span>
                    </span>
                  )}
                </div>

                {/* Clinical Note Commentary */}
                <p className="text-xs text-slate-900 dark:text-slate-200 font-medium leading-relaxed mb-2.5">
                  "{node.clinicalNote}"
                </p>

                {/* Cryptographic Footprint Footer */}
                <div className="pt-2 border-t border-slate-300 dark:border-slate-800 text-[10px] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{node.timestamp}</span>
                  </div>
                  <div className="truncate max-w-[200px] text-slate-700 font-mono font-medium dark:text-slate-400" title={node.hash}>
                    Hash: <span className="font-bold">{node.hash.slice(0, 10)}...{node.hash.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Action Section: Doctor Action Card vs Patient Portal View */}
      {isPatient ? (
        /* Patient Portal View */
        <div 
          id="patient-portal-consensus-card"
          className="p-4 rounded-2xl neumo-card-subtle border-l-4 border-l-emerald-500 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg neumo-inset flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Patient Portal: Diagnostic Review Finalized
            </h3>
          </div>

          <div className="p-3.5 rounded-xl neumo-inset space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Consensus Finalized: 2/3 Doctors Approved with Volar Plating Recommended
            </p>
            <p className="text-[11px] text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
              Your orthopedic radiograph has undergone multi-physician cryptographic consensus on-premise. Dr. Rajesh Sharma and Dr. Priya Patel have confirmed the hairline cortical breach without carpal involvement.
            </p>
            <div className="pt-2 border-t border-slate-300 dark:border-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-400 space-y-1">
              <div>Verified By: Dr. Rajesh Sharma (Chief Orthopedic Surgeon)</div>
              <div>Secondary Review: Dr. Priya Patel (Senior Radiologist)</div>
              <div>Discharge Advisory: Sugar-tong immobilization in neutral position; pre-op volar plating scheduled.</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-800 dark:text-emerald-400 font-bold">
            <span>Proof Status: Groth16 Verified</span>
            <span>Zero PHI Disclosed to Cloud</span>
          </div>
        </div>
      ) : (
        /* Active Doctor Action Card (Matching Neumorphic Controls from Image) */
        <form 
          id="doctor-consensus-action-card"
          onSubmit={handleSignAndCommit}
          className="p-4 rounded-2xl neumo-card-subtle space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Active Reviewer: {currentPersona.name}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
              Key: {currentPersona.publicKey.slice(0, 6)}...{currentPersona.publicKey.slice(-4)}
            </span>
          </div>

          {/* Consensus Triage Radios: Modeled as Neumorphic Segmented Tabs */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
              Consensus Triage:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setDecision('approve')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  decision === 'approve'
                    ? 'neumo-pressed text-emerald-800 dark:text-emerald-400'
                    : 'neumo-btn text-slate-800 dark:text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="whitespace-nowrap">Approve</span>
              </button>

              <button 
                type="button"
                onClick={() => setDecision('modify')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  decision === 'modify'
                    ? 'neumo-pressed text-amber-800 dark:text-amber-400'
                    : 'neumo-btn text-slate-800 dark:text-slate-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="whitespace-nowrap">Modify</span>
              </button>

              <button 
                type="button"
                onClick={() => setDecision('reject')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  decision === 'reject'
                    ? 'neumo-pressed text-rose-800 dark:text-rose-400'
                    : 'neumo-btn text-slate-800 dark:text-slate-300'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="whitespace-nowrap">Reject</span>
              </button>
            </div>
          </div>

          {/* Clinical Note Textarea (Neumorphic Inset Well) */}
          <div>
            <label htmlFor="clinical-note-textarea" className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 mb-1">
              Physician Commentary & Instructions:
            </label>
            <textarea
              id="clinical-note-textarea"
              rows={2}
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="e.g., Cortical breach confirmed. Immobilize in sugar-tong splint; proceed with pre-op volar plating protocol..."
              className="w-full neumo-inset rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 font-medium resize-none transition"
              required
            />
          </div>

          {/* Submit Button: Modeled as Neumorphic Tactile Pill Button */}
          <button
            type="submit"
            id="btn-sign-dag-review"
            disabled={isSigning || !clinicalNote.trim()}
            className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 neumo-btn"
            style={{
              backgroundColor: '#5b5fc7'
            }}
          >
            {isSigning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Generating Curve25519 Signature...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Sign Review via Ed25519 & Commit to DAG</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
