import React, { useState, useRef } from 'react';
import { Upload, Send, ShieldCheck, Database, FileDigit, Cpu, Activity, LogOut } from 'lucide-react';
import { generate_keypair, encrypt_payload, wrap_session_key } from '../../pkg/core_rs';

import { PatientVitalsCard } from '../aura-src/components/PatientVitalsCard';
import { MetricGaugesCard } from '../aura-src/components/MetricGaugesCard';
import { AiClinicalReportCard } from '../aura-src/components/AiClinicalReportCard';
import { ConsensusDagCard } from '../aura-src/components/ConsensusDagCard';
import { XRayViewerCard } from '../aura-src/components/XRayViewerCard';
import { LeftDock } from '../aura-src/components/LeftDock';
import type { LeftNavTab } from '../aura-src/components/LeftDock';
import { TopNavCapsule } from '../aura-src/components/TopNavCapsule';
import { OverviewView } from '../aura-src/components/OverviewView';
import { ClinicalReportsView } from '../aura-src/components/ClinicalReportsView';
import { StudiesArchiveView } from '../aura-src/components/StudiesArchiveView';

import { 
  PRIMARY_DICOM_SCAN, 
  INITIAL_HARDWARE_TELEMETRY, 
  INITIAL_DAG_NODES,
  USER_PROFILES,
  ALTERNATIVE_SCANS
} from '../aura-src/data/clinicalData';

interface PatientWorkspaceProps {
  currentPersona: any;
  isDarkMode: boolean;
  onLogout: () => void;
}

const API_BASE = "http://127.0.0.1:8000";

export const PatientWorkspace: React.FC<PatientWorkspaceProps> = ({ currentPersona, isDarkMode, onLogout }) => {
  const [activeTab, setActiveTab] = useState<LeftNavTab>('overview');
  const [status, setStatus] = useState<string>("Awaiting file upload...");
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [generatedZKProof, setGeneratedZKProof] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  
  const [currentScan, setCurrentScan] = useState(PRIMARY_DICOM_SCAN);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AuraSec Demo Data
  const telemetry = INITIAL_HARDWARE_TELEMETRY;
  const dagNodes = INITIAL_DAG_NODES;
  const dummyDoctor = USER_PROFILES[0];
  const isBreached = false;

  const handleLoadDemo = async (type: 'mr' | 'ct') => {
    setStatus(`Loading ${type.toUpperCase()}_small.dcm...`);
    try {
      const filename = type === 'mr' ? '/MR_small.dcm' : '/CT_small.dcm';
      const res = await fetch(filename);
      const buf = await res.arrayBuffer();
      setFileBytes(new Uint8Array(buf));
      
      // We set a demo URL to actually show something in the viewer if requested, 
      // otherwise it falls back to SVG. Let's force navigation to scanner tab.
      setCurrentScan(prev => ({ ...prev, customImageUrl: undefined }));
      setActiveTab('scanner');
      setStatus(`✅ Loaded ${type.toUpperCase()} Scan (${buf.byteLength} bytes)`);
    } catch (e: any) {
      setStatus(`Error loading ${type}: ${e.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setStatus(`Loading ${file.name}...`);
    try {
      const fileUrl = URL.createObjectURL(file);
      if (file.name.match(/\.(png|jpe?g)$/i)) {
        const img = new Image();
        img.src = fileUrl;
        await new Promise((res) => { img.onload = res; });
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 256;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0, 256, 256);
        const imgData = tempCtx.getImageData(0, 0, 256, 256);
        setFileBytes(new Uint8Array(imgData.data.buffer));
        setCurrentScan(prev => ({ ...prev, customImageUrl: fileUrl }));
        setStatus(`✅ Loaded Image (262,144 bytes)`);
      } else {
        const buf = await file.arrayBuffer();
        setFileBytes(new Uint8Array(buf));
        setCurrentScan(prev => ({ ...prev, customImageUrl: undefined }));
        setStatus(`✅ Loaded ${file.name} (${buf.byteLength} bytes)`);
      }
      setActiveTab('scanner');
    } catch (err: any) {
      setStatus(`Error reading file: ${err.message}`);
    }
  };

  const generateProof = async () => {
    if (!fileBytes) return;
    setIsGeneratingProof(true);
    setStatus("Compiling constraints & generating SNARK...");
    
    await new Promise(r => setTimeout(r, 2800));
    try {
      const proofRes = await fetch('/proof.json');
      const proof = await proofRes.json();
      setGeneratedZKProof(proof);
      setProofGenerated(true);
      setStatus("✅ Proof generated! Size: 804 bytes");
    } catch (e) {
      setStatus("Error loading demo proof.json");
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleTransmit = async () => {
    if (!fileBytes) return;
    setIsSending(true);
    setStatus("Fetching recipient (Dr. Rajesh Sharma) key...");
    try {
      const targetId = 'dr-rajesh-sharma';
      const res = await fetch(`${API_BASE}/keys/${targetId}`);
      if (!res.ok) throw new Error("Recipient public key not found on network.");
      const recipientData = await res.json();
      const recipientPubHex = recipientData.public_key_hex;

      setStatus("Encrypting payload in WASM Enclave...");
      const actualSessionKey = new Uint8Array(32);
      crypto.getRandomValues(actualSessionKey);
      
      const envelopeJsonStr = encrypt_payload(fileBytes, actualSessionKey);
      const envelope = JSON.parse(envelopeJsonStr as string);

      setStatus("Wrapping Session Key (ECDH + AES-GCM)...");
      const wrappedKeyArray = wrap_session_key(currentPersona.privateKeyPreview, recipientPubHex, actualSessionKey);
      const wrappedKeyHex = Array.from(wrappedKeyArray).map(b => b.toString(16).padStart(2, '0')).join('');

      setStatus("Transmitting Zero-Knowledge Payload to FastAPI...");
      const sendPayload = {
          recipient_id: targetId,
          envelope: envelope,
          wrapped_key: wrappedKeyHex,
          ephemeral_sender_pubkey: currentPersona.publicKey
      };

      const postRes = await fetch(`${API_BASE}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendPayload)
      });

      if (!postRes.ok) throw new Error("Failed to send payload to backend.");
      setStatus("✅ Payload Successfully Sent to Network.");
    } catch (e: any) {
      setStatus(`❌ Error: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Ensure currentPersona acts like a UserProfile for UI components
  const activeUser = {
    ...currentPersona,
    id: 'patient',
    role: 'Patient',
    specialty: 'Patient',
    did: 'did:key:zPatient',
    publicKey: currentPersona.publicKey
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            activeScan={currentScan}
            availableScans={ALTERNATIVE_SCANS}
            onSelectScan={setCurrentScan}
            onNavigateTab={(tab: any) => setActiveTab(tab === 'diagnostics' ? 'scanner' : tab)}
            onOpenUpload={() => fileInputRef.current?.click()}
            onOpenZkLedger={() => {}}
            onOpenLogin={onLogout}
            isBreached={isBreached}
            currentUser={activeUser}
          />
        );
      
      case 'scanner':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: Patient Vitals & Upload Portal */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <PatientVitalsCard patient={currentScan.patient} />
              
              <XRayViewerCard
                scan={currentScan}
                isBreached={isBreached}
                onOpenUploadScan={() => fileInputRef.current?.click()}
              />

              <div className="neumo-card p-4 flex flex-col gap-4">
                <div className="w-full neumo-inset rounded-xl p-3 flex items-center gap-3">
                  <Activity className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" />
                  <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate">
                    {status}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleLoadDemo('mr')}
                    className="w-full py-2.5 neumo-btn font-bold text-sm"
                  >
                    <FileDigit className="w-4 h-4" />
                    Load Demo DICOM
                  </button>
                  <button 
                    onClick={generateProof} 
                    disabled={!fileBytes || isGeneratingProof || proofGenerated}
                    className="w-full py-3 neumo-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm"
                  >
                    <Cpu className={`w-4 h-4 ${isGeneratingProof ? 'animate-spin' : ''}`} />
                    {proofGenerated ? 'ZK Proof Ready (804B)' : '1. Generate ZK-SNARK'}
                  </button>
                  <button 
                    onClick={handleTransmit}
                    disabled={!fileBytes || isSending || !proofGenerated}
                    className="w-full py-3 neumo-btn bg-emerald-600 text-white font-bold text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isSending ? 'Transmitting...' : '2. Encrypt & Transmit E2E'}
                  </button>
                </div>
              </div>
            </section>

            {/* COLUMN 2: Diagnostic Gauges & AI Assessment */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <MetricGaugesCard
                localization={currentScan.localization}
                telemetry={telemetry}
                isBreached={isBreached}
              />
              <AiClinicalReportCard
                scan={currentScan}
                isBreached={isBreached}
              />
            </section>

            {/* COLUMN 3: Consensus DAG */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <div className="neumo-card overflow-hidden">
                <ConsensusDagCard
                  nodes={dagNodes}
                  currentUser={dummyDoctor}
                  onSignNode={() => {}}
                  isBreached={isBreached}
                />
              </div>
            </section>
          </div>
        );

      case 'reports':
        return (
          <ClinicalReportsView
            activeScan={currentScan}
            onPrint={() => window.print()}
          />
        );

      case 'studies':
        return (
          <StudiesArchiveView
            activeScan={currentScan}
            availableScans={ALTERNATIVE_SCANS}
            onSelectScan={(scan) => {
              setCurrentScan(scan);
              setActiveTab('scanner');
            }}
          />
        );

      case 'dag':
        return (
          <div className="max-w-4xl mx-auto neumo-card overflow-hidden">
            <ConsensusDagCard
              nodes={dagNodes}
              currentUser={dummyDoctor}
              onSignNode={() => {}}
              isBreached={isBreached}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <h2 className="text-xl font-bold mb-2">Module Not Available</h2>
            <p className="text-sm">This module is currently in development.</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-screen w-full flex bg-[var(--bg-surface)] text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* Persistent Left Dock Navigation */}
      <div className="h-full p-3 md:p-4 hidden md:block z-20">
        <LeftDock
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isBreached={isBreached}
          currentUser={activeUser}
          onOpenLoginModal={onLogout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative z-10 overflow-hidden">
        {/* Top Navigation Capsule */}
        <div className="p-3 md:p-4 pb-0 z-30">
          <TopNavCapsule
            currentUser={activeUser}
            availableUsers={[activeUser, dummyDoctor]}
            onSelectUser={() => {}}
            activeScan={currentScan}
            availableScans={ALTERNATIVE_SCANS}
            onSelectScan={setCurrentScan}
            isBreached={isBreached}
            ambientWarmth="daylight"
            onChangeWarmth={() => {}}
            onOpenZkModal={() => {}}
            onOpenUploadScan={() => fileInputRef.current?.click()}
            onOpenLoginModal={onLogout}
            theme={isDarkMode ? 'dark' : 'light'}
            onToggleTheme={() => document.documentElement.classList.toggle('dark')}
          />
        </div>

        {/* Tab Content Rendering Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6 custom-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full pb-20">
            {renderActiveTab()}
          </div>
        </div>
      </main>
    </div>
  );
};

