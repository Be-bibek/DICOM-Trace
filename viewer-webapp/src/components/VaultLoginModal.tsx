import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  FileCode2, 
  UserCheck, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { Persona } from '../types';
import { CLINICAL_PERSONAS } from '../data/personas';
import { ThemeToggle } from './ThemeToggle';

interface VaultLoginModalProps {
  onAuthenticated: (persona: Persona) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenShowcase?: () => void;
}

export const VaultLoginModal: React.FC<VaultLoginModalProps> = ({ 
  onAuthenticated,
  isDarkMode = false,
  onToggleTheme,
  onOpenShowcase
}) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(CLINICAL_PERSONAS[0]);
  const [privateKeyHex, setPrivateKeyHex] = useState<string>(CLINICAL_PERSONAS[0].privateKeyPreview);
  const [authMode, setAuthMode] = useState<'personas' | 'rawKey'>('personas');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileLoadedName, setFileLoadedName] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handshakeLogs = [
    { title: 'Deriving Ephemeral Nonce', detail: '0x8f2c...41b0 via CSPRNG (Entropy: 256-bit)' },
    { title: 'Signing Challenge with Ed25519', detail: 'Edwards-curve scalar multiplication in Enclave' },
    { title: 'Evaluating Groth16 ZK-Proof', detail: '119,565 R1CS constraints satisfied | 0 bits leaked' },
    { title: 'Mounting WASM Ephemeral Heap', detail: 'Zero disk persistence | Volatile RAM allocated' },
  ];

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    setPrivateKeyHex(persona.privateKeyPreview);
    setFileLoadedName(null);
    setKeyError(null);
  };

  const handleKeyChange = (val: string) => {
    setPrivateKeyHex(val);
    setKeyError(null);
    const match = CLINICAL_PERSONAS.find(p => p.privateKeyPreview.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setSelectedPersona(match);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileLoadedName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const cleaned = content.trim();
        setPrivateKeyHex(cleaned.startsWith('0x') ? cleaned : `0x${cleaned}`);
        const match = CLINICAL_PERSONAS.find(p => p.name.toLowerCase().includes(file.name.toLowerCase()));
        if (match) {
          setSelectedPersona(match);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerHandshake = () => {
    if (!privateKeyHex || privateKeyHex.length < 16) {
      setKeyError('Invalid Ed25519 private key. Minimum 64-char hex required.');
      return;
    }

    setIsHandshaking(true);
    setHandshakeStep(0);

    const stepInterval = setInterval(() => {
      setHandshakeStep((prev) => {
        if (prev >= handshakeLogs.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            onAuthenticated(selectedPersona);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
      {/* Top Floating Controls Bar: Theme Switch & UI Showcase */}
      <div className="fixed top-5 right-5 z-20 flex items-center gap-3">
        {onOpenShowcase && (
          <button
            type="button"
            onClick={onOpenShowcase}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full neumo-btn text-xs font-semibold text-[#5b5fc7] dark:text-indigo-400"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SoftwareWOW! UI</span>
          </button>
        )}
        {onToggleTheme && (
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        )}
      </div>

      {/* Centered Neumorphic Modal Card */}
      <div 
        id="vault-login-modal"
        className="w-full max-w-md neumo-card p-7 sm:p-8 text-slate-800 dark:text-slate-100 transition-all duration-300 relative"
      >
        {/* Header Emblem + Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl neumo-inset flex items-center justify-center mb-3.5 text-indigo-700 dark:text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SentinelMark Cryptographic Vault
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 max-w-xs">
            Zero-Trust On-Premise Clinical AI. Key-based authentication with Groth16 zero-knowledge proofs.
          </p>
        </div>

        {/* Mode Selector: Segmented Neumorphic Pill [ 1 | 2 ] */}
        <div className="p-1 neumo-inset rounded-full flex items-center mb-5">
          <button
            type="button"
            id="tab-personas"
            onClick={() => setAuthMode('personas')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'personas'
                ? 'neumo-card-subtle text-indigo-800 dark:text-indigo-400 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Clinical Personas</span>
          </button>

          <button
            type="button"
            id="tab-raw-key"
            onClick={() => setAuthMode('rawKey')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'rawKey'
                ? 'neumo-card-subtle text-indigo-800 dark:text-indigo-400 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Raw Key / Dropper</span>
          </button>
        </div>

        {/* Mode 1: Clinical Personas List */}
        {authMode === 'personas' && (
          <div className="space-y-2.5 mb-6">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Enclave Authority:
            </label>
            {CLINICAL_PERSONAS.map((persona) => {
              const isSelected = selectedPersona.id === persona.id;
              return (
                <div
                  key={persona.id}
                  id={`persona-card-${persona.id}`}
                  onClick={() => handlePersonaSelect(persona)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'neumo-pressed border-l-4 border-l-indigo-700 dark:border-l-indigo-400'
                      : 'neumo-card-subtle hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${persona.avatarColor} text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-xs border border-white/80 dark:border-white/20 shrink-0`}>
                      {persona.avatarInitials}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {persona.name}
                        </span>
                        {persona.type === 'patient' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 font-bold font-mono">
                            Patient
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                        {persona.roleTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-indigo-800 dark:text-indigo-400 block font-bold">
                      {persona.publicKey.slice(0, 6)}...{persona.publicKey.slice(-4)}
                    </span>
                    <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">Ed25519 Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Raw Key / File Dropper */}
        {authMode === 'rawKey' && (
          <div className="space-y-4 mb-6">
            {/* Drag & Drop Key File Plate */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-2xl cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 ${
                dragOver 
                  ? 'neumo-pressed border-2 border-dashed border-indigo-700' 
                  : 'neumo-inset'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".key,.pem,.txt"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
              <UploadCloud className="w-7 h-7 text-indigo-700 dark:text-indigo-400" />
              <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {fileLoadedName ? (
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{fileLoadedName} loaded</span>
                ) : (
                  <span>Drop your <span className="font-mono text-indigo-800 dark:text-indigo-400 font-bold">.key</span> credential file here</span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">or click to browse filesystem</span>
            </div>

            {/* Manual Hex Input */}
            <div>
              <label htmlFor="raw-private-key-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Curve25519 Seed Key (Hex):
              </label>
              <input
                id="raw-private-key-input"
                type="password"
                value={privateKeyHex}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="0x8f2ca19..."
                className="w-full neumo-inset rounded-xl p-2.5 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 font-medium transition"
              />
            </div>
          </div>
        )}

        {/* Key Validation Error Notice */}
        {keyError && (
          <div className="mb-4 p-2.5 rounded-xl neumo-inset bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{keyError}</span>
          </div>
        )}

        {/* Handshake Progress Animation Overlay / Display */}
        {isHandshaking ? (
          <div className="p-4 rounded-2xl neumo-inset space-y-3 mb-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#5b5fc7] dark:text-indigo-400 animate-spin" />
                Zero-Knowledge Enclave Attestation
              </span>
              <span className="font-mono text-[#5b5fc7] dark:text-indigo-400 font-bold">
                Step {handshakeStep + 1}/4
              </span>
            </div>

            {/* Progress Step Indicator */}
            <div className="w-full h-2 rounded-full neumo-inset-sm overflow-hidden p-0.5">
              <div 
                className="h-full bg-[#5b5fc7] dark:bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((handshakeStep + 1) / 4) * 100}%` }}
              />
            </div>

            <div className="text-left space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {handshakeLogs[handshakeStep].title}
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {handshakeLogs[handshakeStep].detail}
              </p>
            </div>
          </div>
        ) : (
          /* Primary Authenticate Action Button */
          <button
            type="button"
            id="btn-trigger-vault-handshake"
            onClick={triggerHandshake}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2 neumo-btn shadow-lg"
            style={{
              backgroundColor: '#5b5fc7'
            }}
          >
            <KeyRound className="w-4 h-4 text-white" />
            <span>Authenticate to Enclave</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Footer Privacy Guarantee */}
        <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#5b5fc7] dark:text-indigo-400" />
          <span>No passwords stored. No PHI leaks to untrusted networks.</span>
        </div>
      </div>
    </div>
  );
};
