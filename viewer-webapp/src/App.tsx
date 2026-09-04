import React, { useState, useEffect } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { VaultLoginModal } from './components/VaultLoginModal';
import { DynamicIslandTelemetry } from './components/DynamicIslandTelemetry';
import { DiagnosticViewport } from './components/DiagnosticViewport';
import { ConsensusDAGLedger } from './components/ConsensusDAGLedger';
import { VolatileMemoryGuardBar } from './components/VolatileMemoryGuardBar';
import { ZKProofDetailsModal } from './components/ZKProofDetailsModal';
import { NeumorphicShowcaseDrawer } from './components/NeumorphicShowcaseDrawer';
import { PatientWorkspace } from './components/PatientWorkspace';
import { DoctorWorkspace } from './components/DoctorWorkspace';
import type { Persona, DAGNode } from './types';
import { CLINICAL_PERSONAS } from './data/personas';
import { INITIAL_DAG_CHAIN } from './data/initialChain';
import { 
  ScanLine, 
  GitCommit, 
  Cpu
} from 'lucide-react';

import init from '../pkg/core_rs';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>(CLINICAL_PERSONAS[0]);
  const [dagNodes, setDagNodes] = useState<DAGNode[]>(INITIAL_DAG_CHAIN);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState<boolean>(false);
  const [isWasmReady, setIsWasmReady] = useState<boolean>(false);

  // Initialize WASM on mount
  useEffect(() => {
    async function loadWasm() {
      try {
        await init();
        setIsWasmReady(true);
        console.log("WASM Module Initialized");
      } catch (err) {
        console.error("Failed to initialize WASM", err);
      }
    }
    loadWasm();
  }, []);

  const handleAuthenticated = async (persona: Persona) => {
    setCurrentPersona(persona);
    setIsAuthenticated(true);
    
    // Register the key with the backend
    try {
      await fetch("http://127.0.0.1:8000/keys/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: persona.id, public_key_hex: persona.publicKey })
      });
      console.log(`Registered public key for ${persona.id}`);
    } catch (err) {
      console.error("Failed to register key", err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCommitReview = (newNode: DAGNode) => {
    setDagNodes((prev) => [...prev, newNode]);
  };

  if (!isWasmReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e4e7f0] dark:bg-[#141724]">
        <div className="text-slate-500 font-mono text-sm animate-pulse">Initializing SentinelMark Core WASM...</div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'text-slate-100 bg-[#141724]' : 'text-slate-900 bg-[#e4e7f0]'
    }`}>
      <AmbientBackdrop isDarkMode={isDarkMode} />

      {!isAuthenticated ? (
        <VaultLoginModal 
          onAuthenticated={handleAuthenticated}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
        />
      ) : (
        <div className="relative z-10 flex flex-col min-h-screen">
          {currentPersona.type === 'patient' ? (
            <PatientWorkspace 
              currentPersona={currentPersona}
              isDarkMode={isDarkMode}
              onLogout={handleLogout}
            />
          ) : (
            <DoctorWorkspace
              currentPersona={currentPersona}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              dagNodes={dagNodes}
              onCommitReview={handleCommitReview}
              onOpenShowcase={() => setIsShowcaseOpen(true)}
            />
          )}
        </div>
      )}

      <NeumorphicShowcaseDrawer
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
