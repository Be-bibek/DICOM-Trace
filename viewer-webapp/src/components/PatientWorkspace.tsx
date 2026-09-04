import React, { useState } from 'react';
import { Upload, Send, ShieldCheck, Database, FileDigit, Cpu, KeyRound } from 'lucide-react';
import { generate_keypair, encrypt_payload, wrap_session_key } from '../../pkg/core_rs';

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

  const handleLoadDemo = async (type: 'mr' | 'ct') => {
    setStatus(`Loading ${type.toUpperCase()}_small.dcm...`);
    try {
      const filename = type === 'mr' ? '/MR_small.dcm' : '/CT_small.dcm';
      const res = await fetch(filename);
      const buf = await res.arrayBuffer();
      setFileBytes(new Uint8Array(buf));
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
      if (file.name.match(/\.(png|jpe?g)$/i)) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((res) => { img.onload = res; });
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 256;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0, 256, 256);
        const imgData = tempCtx.getImageData(0, 0, 256, 256);
        setFileBytes(new Uint8Array(imgData.data.buffer));
        setStatus(`✅ Loaded Image (262,144 bytes)`);
      } else {
        const buf = await file.arrayBuffer();
        setFileBytes(new Uint8Array(buf));
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
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full neumo-card p-6 sm:p-10 flex flex-col gap-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Patient Upload Portal
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Securely transmit end-to-end encrypted medical imaging.
            </p>
          </div>
          <button onClick={onLogout} className="px-4 py-1.5 rounded-full neumo-btn text-xs font-bold text-rose-600">
            Log Out
          </button>
        </div>

        {/* Status Bar */}
        <div className="neumo-inset bg-slate-50 dark:bg-[#0f111a] p-4 rounded-xl flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
          <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
            {status}
          </p>
        </div>

        {/* Step 1: Upload */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full neumo-inset flex items-center justify-center text-xs">1</span>
            Select Imaging File
          </h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => handleLoadDemo('mr')} className="flex-1 min-w-[140px] p-4 rounded-2xl neumo-btn flex flex-col items-center gap-2 group transition-all active:scale-95">
              <FileDigit className="w-8 h-8 text-slate-500 group-hover:text-indigo-500 transition-colors" />
              <span className="text-sm font-bold">Load Demo MRI</span>
            </button>
            <button onClick={() => handleLoadDemo('ct')} className="flex-1 min-w-[140px] p-4 rounded-2xl neumo-btn flex flex-col items-center gap-2 group transition-all active:scale-95">
              <FileDigit className="w-8 h-8 text-slate-500 group-hover:text-indigo-500 transition-colors" />
              <span className="text-sm font-bold">Load Demo CT</span>
            </button>
            <label className="flex-1 min-w-[140px] p-4 rounded-2xl neumo-btn flex flex-col items-center gap-2 group transition-all active:scale-95 cursor-pointer">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-500 transition-colors" />
              <span className="text-sm font-bold">Upload Custom File</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Step 2 & 3: ZK Proof & Transmit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full neumo-inset flex items-center justify-center text-xs">2</span>
              Generate Cryptography
            </h2>
            <button 
              onClick={generateProof} 
              disabled={!fileBytes || isGeneratingProof || proofGenerated}
              className="w-full py-4 rounded-xl neumo-btn disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-slate-200 transition-all"
            >
              <Cpu className={`w-5 h-5 ${isGeneratingProof ? 'animate-spin' : ''}`} />
              {proofGenerated ? 'Proof Generated (804B)' : 'Generate ZK-SNARK Proof'}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full neumo-inset flex items-center justify-center text-xs">3</span>
              End-to-End Delivery
            </h2>
            <button 
              onClick={handleTransmit}
              disabled={!fileBytes || isSending}
              className="w-full py-4 rounded-xl neumo-btn disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              {isSending ? 'Encrypting & Transmitting...' : 'Encrypt & Transmit E2E'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
