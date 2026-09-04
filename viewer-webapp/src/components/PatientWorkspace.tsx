import React, { useState, useRef } from 'react';
import { Upload, Send, ShieldCheck, Database, FileDigit, Cpu, Activity, LogOut } from 'lucide-react';
import { generate_keypair, encrypt_payload, wrap_session_key } from '../../pkg/core_rs';

import { PatientVitalsCard } from '../aura-src/components/PatientVitalsCard';
import { MetricGaugesCard } from '../aura-src/components/MetricGaugesCard';
import { AiClinicalReportCard } from '../aura-src/components/AiClinicalReportCard';
import { ConsensusDagCard } from '../aura-src/components/ConsensusDagCard';
import { XRayViewerCard } from '../aura-src/components/XRayViewerCard';
import { 
  PRIMARY_DICOM_SCAN, 
  INITIAL_HARDWARE_TELEMETRY, 
  INITIAL_DAG_NODES,
  USER_PROFILES
} from '../aura-src/data/clinicalData';

interface PatientWorkspaceProps {
  currentPersona: any;
  isDarkMode: boolean;
  onLogout: () => void;
}

const API_BASE = "http://127.0.0.1:8000";

export const PatientWorkspace: React.FC<PatientWorkspaceProps> = ({ currentPersona, isDarkMode, onLogout }) => {
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

  const handleLoadDemo = async (type: 'mr' | 'ct') => {
    setStatus(`Loading ${type.toUpperCase()}_small.dcm...`);
    try {
      const filename = type === 'mr' ? '/MR_small.dcm' : '/CT_small.dcm';
      const res = await fetch(filename);
      const buf = await res.arrayBuffer();
      setFileBytes(new Uint8Array(buf));
      setCurrentScan(prev => ({ ...prev, customImageUrl: undefined }));
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
    } catch (err: any) {
      setStatus(`Error reading file: ${err.message}`);
    }
  };

  const generateProof = async () => {
    if (!fileBytes) return;
    setIsGeneratingProof(true);
    setStatus("Compiling constraints & generating SNARK...");
    
    // Simulating proof generation delay
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
      const targetId = 'dr-rajesh-sharma'; // Default target
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
      // Use the patient's own keys that were registered
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

  return (
    <div className={`relative min-h-screen w-full flex flex-col p-4 md:p-8 overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 antialiased ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Top Navbar Simulation */}
      <div className="w-full max-w-[1580px] mx-auto flex items-center justify-between mb-6 neumo-card-subtle px-6 py-3">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Patient Portal</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Secure ZK End-to-End Delivery</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-300">
              <img src={currentPersona.avatar} alt="Patient" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold">{currentPersona.name}</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors text-xs font-bold">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="w-full max-w-[1580px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Patient Vitals & Upload Portal */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <PatientVitalsCard patient={currentScan.patient} />
          
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

          {/* New XRay Viewer Card featuring Image Preview, AI Overlays & Grayscale inversion */}
          <XRayViewerCard
            scan={currentScan}
            isBreached={false}
            onOpenUploadScan={() => fileInputRef.current?.click()}
          />

          {/* Core ZK Encryption & Transmission controls */}
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
            isBreached={false}
          />
          <AiClinicalReportCard
            scan={currentScan}
            isBreached={false}
          />
        </section>

        {/* COLUMN 3: Consensus DAG */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <ConsensusDagCard
            nodes={dagNodes}
            currentUser={dummyDoctor}
            onSignNode={() => {}}
            isBreached={false}
          />
        </section>

      </div>
    </div>
  );
};
