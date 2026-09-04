/**
 * SentinelMark: Zero-Trust Clinical Diagnostic Suite
 * Full-Scale Web Application Architecture
 */

import React, { useState, useEffect } from 'react';
import { SpatialBackdrop } from './components/SpatialBackdrop';
import { LeftDock, LeftNavTab } from './components/LeftDock';
import { TopNavCapsule } from './components/TopNavCapsule';
import { PatientVitalsCard } from './components/PatientVitalsCard';
import { XRayViewerCard } from './components/XRayViewerCard';
import { AttackSimulationBanner } from './components/AttackSimulationBanner';
import { MetricGaugesCard } from './components/MetricGaugesCard';
import { AiClinicalReportCard } from './components/AiClinicalReportCard';
import { ConsensusDagCard } from './components/ConsensusDagCard';
import { OverviewView } from './components/OverviewView';
import { StudiesArchiveView } from './components/StudiesArchiveView';
import { ClinicalReportsView } from './components/ClinicalReportsView';
import { EnclaveLoginModal } from './components/EnclaveLoginModal';
import { UploadScanModal } from './components/UploadScanModal';
import { ZkLedgerModal } from './components/ZkLedgerModal';
import { AddSpecialistModal } from './components/AddSpecialistModal';
import { VaultView } from './components/VaultView';
import { TelemetryDetailView } from './components/TelemetryDetailView';
import { SettingsView } from './components/SettingsView';

import { 
  USER_PROFILES, 
  PRIMARY_DICOM_SCAN, 
  ALTERNATIVE_SCANS, 
  INITIAL_DAG_NODES,
  INITIAL_ZK_METADATA,
  INITIAL_HARDWARE_TELEMETRY
} from './data/clinicalData';
import { 
  UserProfile, 
  DicomScan, 
  DagNode, 
  ConsensusDecision, 
  DepartmentFilter,
  ZkProofMetadata,
  HardwareTelemetry
} from './types';

export default function App() {
  // Clinical State
  const [users, setUsers] = useState<UserProfile[]>(USER_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_PROFILES[0]);
  const [activeScan, setActiveScan] = useState<DicomScan>(PRIMARY_DICOM_SCAN);
  const [availableScans, setAvailableScans] = useState<DicomScan[]>([
    PRIMARY_DICOM_SCAN,
    ...ALTERNATIVE_SCANS
  ]);
  const [dagNodes, setDagNodes] = useState<DagNode[]>(INITIAL_DAG_NODES);
  
  // Adversary simulation state
  const [isBreached, setIsBreached] = useState<boolean>(false);
  const [zkMetadata, setZkMetadata] = useState<ZkProofMetadata>(INITIAL_ZK_METADATA);
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>(INITIAL_HARDWARE_TELEMETRY);

  // Layout & visual state
  const [activeNavTab, setActiveNavTab] = useState<LeftNavTab>('overview');
  const [ambientWarmth, setAmbientWarmth] = useState<'daylight' | 'golden_hour' | 'clinical_pure'>('daylight');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Synchronize root document class for dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Modals
  const [isZkModalOpen, setIsZkModalOpen] = useState<boolean>(false);
  const [isAddSpecialistOpen, setIsAddSpecialistOpen] = useState<boolean>(false);
  const [isEnclaveLoginOpen, setIsEnclaveLoginOpen] = useState<boolean>(false);
  const [isUploadScanOpen, setIsUploadScanOpen] = useState<boolean>(false);

  // Trigger 1-bit tamper attack
  const handleTriggerAttack = () => {
    setIsBreached(true);
    setZkMetadata(prev => ({
      ...prev,
      verificationStatus: 'BREACH_REJECTED',
      tamperAnomalyDetails: '1-bit flip at LSB (x:142, y:288) — Bilinear Groth16 pairing evaluation rejected.'
    }));
    setTelemetry(prev => ({
      ...prev,
      secureEnclaveStatus: 'TAMPER_DETECTED',
      psnrDb: 89.42,
      cpuEntropyVarianceMs: 28.6
    }));
  };

  // Restore cryptographic integrity
  const handleRestoreIntegrity = () => {
    setIsBreached(false);
    setZkMetadata(INITIAL_ZK_METADATA);
    setTelemetry(INITIAL_HARDWARE_TELEMETRY);
  };

  // Sign review and commit new node to hash-chain
  const handleSignReview = (decision: ConsensusDecision, comment: string) => {
    const parentNode = dagNodes[dagNodes.length - 1];
    const timestamp = new Date().toISOString().substring(11, 19) + ' UTC';
    
    // Generate realistic cryptographic hashes
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newHash = `0x${randomHex}${Math.random().toString(16).substring(2, 34)}`;
    const newSig = `0x${Math.random().toString(16).substring(2, 18)}...${Math.random().toString(16).substring(2, 6)}`;

    const newNode: DagNode = {
      id: `node-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.title,
      authorAvatar: currentUser.avatar,
      timestamp: timestamp,
      decision: decision,
      clinicalNote: comment,
      signatureEd25519: newSig,
      parentHash: parentNode ? parentNode.nodeHash : '0x0000',
      nodeHash: newHash
    };

    setDagNodes(prev => [...prev, newNode]);
  };

  // Add specialist to list
  const handleAddSpecialist = (newSpecialist: UserProfile) => {
    setUsers(prev => [...prev, newSpecialist]);
    setCurrentUser(newSpecialist);
  };

  // Replace active scan with custom uploaded image
  const handleReplaceScanImage = (updatedScan: DicomScan) => {
    setActiveScan(updatedScan);
    setAvailableScans(prev => {
      const exists = prev.some(s => s.scanId === updatedScan.scanId);
      if (exists) {
        return prev.map(s => s.scanId === updatedScan.scanId ? updatedScan : s);
      }
      return [updatedScan, ...prev];
    });
  };

  // Reset to default demo scan
  const handleResetDemo = () => {
    setActiveScan(PRIMARY_DICOM_SCAN);
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 lg:p-6 overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-900 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* 1. Neutral SaaS Studio Canvas Backdrop (Inspired by Image 1) */}
      <SpatialBackdrop ambientWarmth={ambientWarmth} theme={theme} />

      {/* Main Website Canvas Container */}
      <div className="relative z-10 w-full max-w-[1580px] mx-auto flex flex-col flex-1 gap-4">
        {/* 2. Top Header Navigation Bar (Global search, study switcher, enclave trigger, upload action) */}
        <TopNavCapsule
          currentUser={currentUser}
          availableUsers={users}
          onSelectUser={setCurrentUser}
          activeScan={activeScan}
          availableScans={availableScans}
          onSelectScan={setActiveScan}
          isBreached={isBreached}
          ambientWarmth={ambientWarmth}
          onChangeWarmth={setAmbientWarmth}
          onOpenZkModal={() => setIsZkModalOpen(true)}
          onOpenUploadScan={() => setIsUploadScanOpen(true)}
          onOpenLoginModal={() => setIsEnclaveLoginOpen(true)}
          onToggleTamper={isBreached ? handleRestoreIntegrity : handleTriggerAttack}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        />

        {/* 3. Main Website Work Area: Left Sidebar Navigation + Central View Stage */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-start gap-4">
          {/* Left Navigation Sidebar (Matching Image 1's left menu) */}
          <div className="shrink-0 self-start md:sticky md:top-4 w-full md:w-auto">
            <LeftDock
              activeTab={activeNavTab}
              onSelectTab={setActiveNavTab}
              isBreached={isBreached}
              currentUser={currentUser}
              onOpenLoginModal={() => setIsEnclaveLoginOpen(true)}
            />
          </div>

          {/* Central Main Panel */}
          <main 
            id="master-workspace"
            className="flex-1 min-w-0 transition-all duration-300"
          >
            {/* TAB 1: Overview Dashboard (Matching Image 1 layout) */}
            {activeNavTab === 'overview' && (
              <OverviewView
                activeScan={activeScan}
                availableScans={availableScans}
                onSelectScan={setActiveScan}
                onNavigateTab={(tab) => {
                  if (tab === 'diagnostics') setActiveNavTab('scanner');
                  else if (tab === 'studies') setActiveNavTab('studies');
                  else if (tab === 'dag') setActiveNavTab('dag');
                  else if (tab === 'security') setActiveNavTab('vault');
                  else if (tab === 'reports') setActiveNavTab('reports');
                }}
                onOpenUpload={() => setIsUploadScanOpen(true)}
                onOpenZkLedger={() => setIsZkModalOpen(true)}
                onOpenLogin={() => setIsEnclaveLoginOpen(true)}
                isBreached={isBreached}
                currentUser={currentUser}
              />
            )}

            {/* TAB 2: Diagnostic Scanner (Interactive Medical Image & AI Localization) */}
            {activeNavTab === 'scanner' && (
              <div 
                id="diagnostic-hub-grid"
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start animate-in fade-in duration-300"
              >
                {/* COLUMN 1: Patient Vitals, Image Viewport & Upload Trigger */}
                <section 
                  id="diagnostic-column-1" 
                  aria-label="Patient Vitals & Fracture Localization"
                  className="lg:col-span-4 flex flex-col gap-4"
                >
                  <PatientVitalsCard patient={activeScan.patient} />
                  <XRayViewerCard 
                    scan={activeScan} 
                    isBreached={isBreached} 
                    onOpenUploadScan={() => setIsUploadScanOpen(true)}
                  />
                  <AttackSimulationBanner
                    isBreached={isBreached}
                    onTriggerAttack={handleTriggerAttack}
                    onRestoreIntegrity={handleRestoreIntegrity}
                  />
                </section>

                {/* COLUMN 2: Diagnostic Gauges & Clinical AI Assessment */}
                <section 
                  id="diagnostic-column-2" 
                  aria-label="Diagnostic Metrics & AI Summary"
                  className="lg:col-span-4 flex flex-col gap-4"
                >
                  <MetricGaugesCard
                    localization={activeScan.localization}
                    telemetry={telemetry}
                    isBreached={isBreached}
                  />
                  <AiClinicalReportCard
                    scan={activeScan}
                    isBreached={isBreached}
                  />
                </section>

                {/* COLUMN 3: Multi-Doctor Consensus DAG & Signing */}
                <section 
                  id="diagnostic-column-3" 
                  aria-label="Multi-Doctor Consensus DAG"
                  className="lg:col-span-4 flex flex-col gap-4"
                >
                  <ConsensusDagCard
                    nodes={dagNodes}
                    currentUser={currentUser}
                    onSignNode={handleSignReview}
                    isBreached={isBreached}
                  />
                </section>
              </div>
            )}

            {/* TAB 3: Studies Archive (Image Library & Scan Replacement) */}
            {activeNavTab === 'studies' && (
              <StudiesArchiveView
                scans={availableScans}
                activeScan={activeScan}
                onSelectScan={setActiveScan}
                onOpenUpload={() => setIsUploadScanOpen(true)}
                onNavigateToScanner={() => setActiveNavTab('scanner')}
                isBreached={isBreached}
              />
            )}

            {/* TAB 4: Consensus DAG Full View */}
            {activeNavTab === 'dag' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cryptographic Consensus DAG & Merkle Trail</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Immutable distributed doctor review nodes bound by SHA-256 and Ed25519 signatures</p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('scanner')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
                  >
                    ← Back to Diagnostic Scanner
                  </button>
                </div>
                <ConsensusDagCard
                  nodes={dagNodes}
                  currentUser={currentUser}
                  onSignNode={handleSignReview}
                  isBreached={isBreached}
                />
              </div>
            )}

            {/* TAB 5: ZK Proof Ledger */}
            {activeNavTab === 'zkledger' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Groth16 Zero-Knowledge SNARK Verification Ledger</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mathematical proof constraints over the BN254 elliptic curve guaranteeing 0 bits PHI leakage</p>
                  </div>
                  <button
                    onClick={() => setIsZkModalOpen(true)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white dark:text-slate-950 bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 shadow-xs transition-colors"
                  >
                    Inspect Deep Circuit
                  </button>
                </div>
                <div className="p-6 rounded-3xl milk-card border border-white dark:border-slate-800 dark:bg-slate-900/85 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verification Status</p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        {isBreached ? 'PROOF REJECTED' : 'VALIDATED (100%)'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Circuit Constraints</p>
                      <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">119,482 R1CS</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Proving Latency</p>
                      <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">14.2 ms</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
                    <p className="text-amber-400 font-bold">Groth16 Verifying Key Hash:</p>
                    <p className="text-[11px] text-slate-300 break-all">{activeScan.watermarkHash}</p>
                    <p className="text-slate-400 text-[10px] pt-1">
                      e(A, B) = e(α, β) · e(x·γ, δ) · e(C, δ) evaluated on Apple Silicon TPM
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Key Vault */}
            {activeNavTab === 'vault' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cryptographic Keyring & Enclave Identities</h2>
                  <button
                    onClick={() => setActiveNavTab('overview')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    ← Back to Overview
                  </button>
                </div>
                <VaultView
                  users={users}
                  zkMetadata={zkMetadata}
                  isBreached={isBreached}
                />
              </div>
            )}

            {/* TAB 7: Clinical Reports */}
            {activeNavTab === 'reports' && (
              <ClinicalReportsView
                scan={activeScan}
                dagNodes={dagNodes}
                isBreached={isBreached}
              />
            )}

            {/* TAB 8: Settings */}
            {activeNavTab === 'settings' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Workspace Configuration</h2>
                  <button
                    onClick={() => setActiveNavTab('overview')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    ← Back to Overview
                  </button>
                </div>
                <SettingsView
                  ambientWarmth={ambientWarmth}
                  onChangeWarmth={setAmbientWarmth}
                  theme={theme}
                  onChangeTheme={setTheme}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Interactive Modal Portals */}
      {/* 1. Enclave Login & Hash Key Reference Modal (Inspired by Image 2) */}
      <EnclaveLoginModal
        isOpen={isEnclaveLoginOpen}
        onClose={() => setIsEnclaveLoginOpen(false)}
        currentUser={currentUser}
        availableUsers={users}
        onSelectUser={(u) => setCurrentUser(u)}
      />

      {/* 2. Upload / Replace Medical Scan Modal (Supports user custom images & SHA-256 calculation) */}
      <UploadScanModal
        isOpen={isUploadScanOpen}
        onClose={() => setIsUploadScanOpen(false)}
        activeScan={activeScan}
        onReplaceScanImage={handleReplaceScanImage}
        onResetDemo={handleResetDemo}
      />

      {/* 3. Deep ZK Circuit Ledger Details Modal */}
      <ZkLedgerModal
        isOpen={isZkModalOpen}
        onClose={() => setIsZkModalOpen(false)}
        metadata={zkMetadata}
        scan={activeScan}
        isBreached={isBreached}
      />

      {/* 4. Add Specialist Modal */}
      <AddSpecialistModal
        isOpen={isAddSpecialistOpen}
        onClose={() => setIsAddSpecialistOpen(false)}
        onAddSpecialist={handleAddSpecialist}
      />
    </div>
  );
}
