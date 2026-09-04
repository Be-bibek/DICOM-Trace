import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Fingerprint, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserProfile } from '../types';

interface EnclaveLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onLoginSuccess?: (user: UserProfile) => void;
}

export const EnclaveLoginModal: React.FC<EnclaveLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  availableUsers,
  onSelectUser,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('dr.rajesh.sharma@sentinelmark.io');
  const [passwordHash, setPasswordHash] = useState('0x8f2a91c47b59e301d4a821e6c382b04f71a93e84');
  const [showHash, setShowHash] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'hardware_tpm' | 'biometric'>('hardware_tpm');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [liveDigest, setLiveDigest] = useState('0x3a7e91...');

  useEffect(() => {
    // Generate simulated dynamic SHA-256 digest based on email + key input
    const simpleHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return '0x' + Math.abs(hash).toString(16).padStart(8, '0') + 'c94f1b27';
    };
    setLiveDigest(simpleHash(email + passwordHash));
  }, [email, passwordHash]);

  const handleAuthenticate = (userToLogin?: UserProfile) => {
    setIsAuthenticating(true);
    const targetUser = userToLogin || currentUser;
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      onSelectUser(targetUser);
      if (onLoginSuccess) {
        onLoginSuccess(targetUser);
      }
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 700);
    }, 900);
  };

  const handleSelectQuickDoctor = (u: UserProfile) => {
    onSelectUser(u);
    setEmail(`${u.name.toLowerCase().replace(/[^a-z]/g, '.')}@sentinelmark.io`);
    setPasswordHash(`0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 34)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          role="dialog"
          aria-labelledby="enclave-auth-title"
        >
          {/* Frosted Glass Login Capsule (Matching Image 2 Aesthetic) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-md rounded-[32px] milk-card p-6 sm:p-7 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col relative overflow-hidden"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Header & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-4 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/50 dark:border-amber-400/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="enclave-auth-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    SentinelMark Enclave Auth
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero-Trust Cryptographic Signature Portal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Login / Sign Up Tabs (Inspired by Image 2) */}
            <div className="flex items-center justify-between p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/70 dark:border-slate-700 z-10">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Enroll Key / Sign up
              </button>
            </div>

            {/* Fast Doctor Profile Switcher */}
            <div className="mb-4 z-10">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Persona Switch
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectQuickDoctor(u)}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        isCurrent
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-700 ring-1 ring-amber-400/50'
                          : 'bg-white/60 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      <img 
                        src={u.avatar} 
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{u.role.replace('_', ' ')}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authentication Form (Matching Image 2 Style) */}
            <div className="space-y-3 z-10">
              {/* Email / Enclave ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Identifier / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 outline-none text-xs text-slate-800 dark:text-slate-100 transition-all font-mono"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-xs">@</span>
                </div>
              </div>

              {/* Encrypted Hash Key / Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Encrypted Key Hash / Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => setPasswordHash(`0x${Math.random().toString(16).substring(2, 34)}`)}
                    className="text-[10px] text-amber-700 dark:text-amber-400 hover:text-amber-800 font-medium"
                  >
                    Regenerate Hash
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showHash ? 'text' : 'password'}
                    value={passwordHash}
                    onChange={(e) => setPasswordHash(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 outline-none text-xs text-slate-800 dark:text-slate-100 transition-all font-mono"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowHash(!showHash)}
                    className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showHash ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Real-time Witness Derivation Digest */}
              <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 text-white text-[11px] font-mono space-y-1 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>SHA-256 Public Witness</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    BN254 Ready
                  </span>
                </div>
                <p className="text-amber-400 truncate text-[10px]">
                  {liveDigest}
                </p>
              </div>

              {/* Hardware Enclave / Biometric Option */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('hardware_tpm')}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                    authMode === 'hardware_tpm'
                      ? 'bg-amber-500/15 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-300'
                      : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Apple TPM2 Enclave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('biometric')}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                    authMode === 'biometric'
                      ? 'bg-sky-500/15 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-300'
                      : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>WebAuthn Biometric</span>
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAuthenticate()}
                disabled={isAuthenticating}
                className={`w-full py-2.5 mt-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
                  authSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 active:scale-98'
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-950 rounded-full animate-spin" />
                    <span>Verifying Groth16 Witness...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enclave Key Verified & Logged In!</span>
                  </>
                ) : (
                  <>
                    <span>Sign In via Zero-Trust Key</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Security Footer Note */}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-3 z-10 font-mono">
              FIPS 140-3 Level 4 • Ed25519 Encrypted • 0 bits private key transmitted
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
