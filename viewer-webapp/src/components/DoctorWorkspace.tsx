import React, { useState } from 'react';
import { DiagnosticViewport } from './DiagnosticViewport';
import { ConsensusDAGLedger } from './ConsensusDAGLedger';
import { VolatileMemoryGuardBar } from './VolatileMemoryGuardBar';
import { DynamicIslandTelemetry } from './DynamicIslandTelemetry';
import { ZKProofDetailsModal } from './ZKProofDetailsModal';
import { ScanLine, GitCommit, Cpu } from 'lucide-react';
import type { Persona, DAGNode } from '../types';

interface DoctorWorkspaceProps {
  currentPersona: Persona;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  dagNodes: DAGNode[];
  onCommitReview: (newNode: DAGNode) => void;
  onOpenShowcase: () => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({
  currentPersona,
  isDarkMode,
  onToggleTheme,
  onLogout,
  dagNodes,
  onCommitReview,
  onOpenShowcase
}) => {
  // Security Simulation States
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isMemoryDumped, setIsMemoryDumped] = useState<boolean>(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState<boolean>(false);
  const [isZKModalOpen, setIsZKModalOpen] = useState<boolean>(false);

  // Mobile navigation tabs for screens < 1024px
  const [mobileTab, setMobileTab] = useState<'viewport' | 'consensus' | 'security'>('viewport');

  // Tamper Simulation Toggle
  const handleToggleTamper = async () => {
    if (!isTampered) {
      try {
        const res = await fetch('http://127.0.0.1:8000/verify/zk-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proof: { pi_a: ["corrupt"], pi_b: [["corrupt"]], pi_c: ["corrupt"], protocol: "groth16" },
            public_signals: ["invalid"]
          })
        });
        setIsTampered(true);
        handleTriggerMemoryDump();
      } catch (err) {
        console.error("Tamper API failed", err);
      }
    } else {
      setIsTampered(false);
      handleRestoreMemory();
    }
  };

  const handleTriggerMemoryDump = () => {
    setIsScreenFlashing(true);
    setTimeout(() => {
      setIsMemoryDumped(true);
      setIsScreenFlashing(false);
    }, 850);
  };

  const handleRestoreMemory = () => {
    setIsMemoryDumped(false);
  };

  return (
    <>
      {/* Screen Red Flash Overlay during Cold-Boot Dump Simulation */}
      {isScreenFlashing && (
        <div 
          id="cold-boot-screen-flash"
          className="fixed inset-0 z-50 pointer-events-none flash-memory-breach backdrop-blur-xs"
        />
      )}

      {/* Top Dynamic Island */}
      <DynamicIslandTelemetry
        currentPersona={currentPersona}
        onLogout={onLogout}
        isTampered={isTampered}
        isMemoryDumped={isMemoryDumped}
        onOpenZKDetails={() => setIsZKModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onOpenShowcase={onOpenShowcase}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 pb-24 lg:pb-6">
        
        {/* Desktop Layout: 2-Column (Left 55%, Right 45%) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Panel 1: Diagnostic Viewport & Edge AI Bounding Box (Left, 55% width -> col-span-7) */}
          <div className="lg:col-span-7 flex flex-col">
            <DiagnosticViewport
              isTampered={isTampered}
              onToggleTamper={handleToggleTamper}
              isMemoryDumped={isMemoryDumped}
              onRestoreMemory={handleRestoreMemory}
              currentPersona={currentPersona}
            />
          </div>

          {/* Panel 2: Consensus DAG & Chained Review Ledger (Right, 45% width -> col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <ConsensusDAGLedger
              currentPersona={currentPersona}
              nodes={dagNodes}
              onCommitReview={onCommitReview}
              isTampered={isTampered}
            />
          </div>
        </div>

        {/* Mobile Layout (< 1024px): Tabbed Views */}
        <div className="lg:hidden flex flex-col gap-4">
          {mobileTab === 'viewport' && (
            <DiagnosticViewport
              isTampered={isTampered}
              onToggleTamper={handleToggleTamper}
              isMemoryDumped={isMemoryDumped}
              onRestoreMemory={handleRestoreMemory}
              currentPersona={currentPersona}
            />
          )}

          {mobileTab === 'consensus' && (
            <ConsensusDAGLedger
              currentPersona={currentPersona}
              nodes={dagNodes}
              onCommitReview={onCommitReview}
              isTampered={isTampered}
            />
          )}

          {mobileTab === 'security' && (
            <div className="space-y-4">
              <VolatileMemoryGuardBar
                isMemoryDumped={isMemoryDumped}
                onTriggerMemoryDump={handleTriggerMemoryDump}
                onRestoreMemory={handleRestoreMemory}
              />
              {/* Quick ZK Circuit Summary Card on mobile */}
              <div className="neumo-card p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                  Zero-Knowledge Telemetry Enclave
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Proving system Groth16 verifying 119,565 R1CS constraints. All cryptographic hashes are generated in WASM volatile linear heap.
                </p>
                <button
                  type="button"
                  onClick={() => setIsZKModalOpen(true)}
                  className="w-full py-2.5 rounded-full neumo-btn text-xs font-bold text-indigo-800 dark:text-indigo-300"
                >
                  Inspect ZK-SNARK Bilinear Pairing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel 3: Volatile Memory Guard Bar (Full-width bottom panel on desktop) */}
        <div className="hidden lg:block w-full">
          <VolatileMemoryGuardBar
            isMemoryDumped={isMemoryDumped}
            onTriggerMemoryDump={handleTriggerMemoryDump}
            onRestoreMemory={handleRestoreMemory}
          />
        </div>
      </main>

      {/* Mobile Bottom Neumorphic Tab Bar (< 1024px) */}
      <nav 
        id="mobile-glass-tab-bar"
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto neumo-card rounded-full p-1.5 flex items-center justify-between shadow-xl"
      >
        <button
          type="button"
          onClick={() => setMobileTab('viewport')}
          className={`flex-1 min-h-[44px] rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
            mobileTab === 'viewport'
              ? 'neumo-pressed text-indigo-800 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-400 hover:text-slate-950'
          }`}
        >
          <ScanLine className="w-4 h-4" />
          <span>Scan & AI</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('consensus')}
          className={`flex-1 min-h-[44px] rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
            mobileTab === 'consensus'
              ? 'neumo-pressed text-indigo-800 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-400 hover:text-slate-950'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Consensus DAG</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('security')}
          className={`flex-1 min-h-[44px] rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
            mobileTab === 'security'
              ? 'neumo-pressed text-indigo-800 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-400 hover:text-slate-950'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Security</span>
        </button>
      </nav>

      {/* Interactive ZK Circuit Details Modal */}
      <ZKProofDetailsModal
        isOpen={isZKModalOpen}
        onClose={() => setIsZKModalOpen(false)}
        isTampered={isTampered}
      />
    </>
  );
};
