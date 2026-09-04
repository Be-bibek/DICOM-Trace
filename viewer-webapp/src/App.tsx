import React, { useState, useEffect } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { VaultLoginModal } from './components/VaultLoginModal';
import { DynamicIslandTelemetry } from './components/DynamicIslandTelemetry';
import { DiagnosticViewport } from './components/DiagnosticViewport';
import { ConsensusDAGLedger } from './components/ConsensusDAGLedger';
import { VolatileMemoryGuardBar } from './components/VolatileMemoryGuardBar';
import { ZKProofDetailsModal } from './components/ZKProofDetailsModal';
import { NeumorphicShowcaseDrawer } from './components/NeumorphicShowcaseDrawer';
import { Persona, DAGNode } from './types';
import { CLINICAL_PERSONAS } from './data/personas';
import { INITIAL_DAG_CHAIN } from './data/initialChain';
import { 
  ScanLine, 
  GitCommit, 
  Cpu
} from 'lucide-react';

export default function App() {
  // Theme state: default to Light Mode (matches SoftwareWOW! claymorphic reference) with 1-click toggle to Dark Clay
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Navigation & Screen states: 1 = Login Modal (Vault), 2 = Diagnostic Suite
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>(CLINICAL_PERSONAS[0]);

  // Consensus DAG chain state
  const [dagNodes, setDagNodes] = useState<DAGNode[]>(INITIAL_DAG_CHAIN);

  // Security Simulation States
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isMemoryDumped, setIsMemoryDumped] = useState<boolean>(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState<boolean>(false);
  const [isZKModalOpen, setIsZKModalOpen] = useState<boolean>(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState<boolean>(false);

  // Mobile navigation tabs for screens < 1024px
  const [mobileTab, setMobileTab] = useState<'viewport' | 'consensus' | 'security'>('viewport');

  // Authentication Handlers
  const handleAuthenticated = (persona: Persona) => {
    setCurrentPersona(persona);
    setIsAuthenticated(true);
    setIsTampered(false);
    setIsMemoryDumped(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsTampered(false);
    setIsMemoryDumped(false);
  };

  // Tamper Simulation Toggle
  const handleToggleTamper = async () => {
    if (!isTampered) {
      // Trigger Tamper: Send corrupted proof to backend
      try {
        const res = await fetch('http://127.0.0.1:8000/verify/zk-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proof: { pi_a: ["corrupt"], pi_b: [["corrupt"]], pi_c: ["corrupt"], protocol: "groth16" },
            public_signals: ["invalid"]
          })
        });
        // We know it will fail, instantly trigger the breach UI
        setIsTampered(true);
        // Wipe memory
        handleTriggerMemoryDump();
      } catch (err) {
        console.error("Tamper API failed", err);
      }
    } else {
      setIsTampered(false);
      handleRestoreMemory();
    }
  };

  // Memory Breach Simulation: Red flash animation + buffer wipe
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

  // Append new node to DAG
  const handleCommitReview = (newNode: DAGNode) => {
    setDagNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'text-slate-100 bg-[#141724]' : 'text-slate-900 bg-[#e4e7f0]'
    }`}>
      {/* Dynamic Ambient Clay Backdrop (Light & Dark) */}
      <AmbientBackdrop isDarkMode={isDarkMode} />

      {/* Screen Red Flash Overlay during Cold-Boot Dump Simulation */}
      {isScreenFlashing && (
        <div 
          id="cold-boot-screen-flash"
          className="fixed inset-0 z-50 pointer-events-none flash-memory-breach backdrop-blur-xs"
        />
      )}

      {/* SCREEN 1: Cryptographic Hash Vault (Login Screen) */}
      {!isAuthenticated ? (
        <VaultLoginModal 
          onAuthenticated={handleAuthenticated}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
        />
      ) : (
        /* SCREEN 2: Collaborative Diagnostic Suite (Main Dashboard) */
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Top Dynamic Island (System & Key Telemetry + Theme Switcher + UI Showcase) */}
          <DynamicIslandTelemetry
            currentPersona={currentPersona}
            onLogout={handleLogout}
            isTampered={isTampered}
            isMemoryDumped={isMemoryDumped}
            onOpenZKDetails={() => setIsZKModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            onOpenShowcase={() => setIsShowcaseOpen(true)}
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
                />
              </div>

              {/* Panel 2: Consensus DAG & Chained Review Ledger (Right, 45% width -> col-span-5) */}
              <div className="lg:col-span-5 flex flex-col">
                <ConsensusDAGLedger
                  currentPersona={currentPersona}
                  nodes={dagNodes}
                  onCommitReview={handleCommitReview}
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
                />
              )}

              {mobileTab === 'consensus' && (
                <ConsensusDAGLedger
                  currentPersona={currentPersona}
                  nodes={dagNodes}
                  onCommitReview={handleCommitReview}
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
              id="btn-mobile-tab-viewport"
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
              id="btn-mobile-tab-consensus"
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
              id="btn-mobile-tab-security"
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
        </div>
      )}

      {/* SoftwareWOW! Neumorphic Component Suite Drawer Modal */}
      <NeumorphicShowcaseDrawer
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
