import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  Sun, 
  Moon,
  ChevronDown, 
  Search, 
  Lock, 
  Volume2, 
  VolumeX,
  Sparkles,
  UploadCloud,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, DicomScan } from '../types';

interface TopNavCapsuleProps {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  activeScan: DicomScan;
  availableScans: DicomScan[];
  onSelectScan: (scan: DicomScan) => void;
  isBreached: boolean;
  ambientWarmth: 'daylight' | 'golden_hour' | 'clinical_pure';
  onChangeWarmth: (w: 'daylight' | 'golden_hour' | 'clinical_pure') => void;
  onOpenZkModal: () => void;
  onOpenUploadScan?: () => void;
  onOpenLoginModal?: () => void;
  onToggleTamper?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const TopNavCapsule: React.FC<TopNavCapsuleProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
  activeScan,
  availableScans,
  onSelectScan,
  isBreached,
  ambientWarmth,
  onChangeWarmth,
  onOpenZkModal,
  onOpenUploadScan,
  onOpenLoginModal,
  onToggleTamper,
  theme = 'light',
  onToggleTheme
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scanDropdownOpen, setScanDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (scanRef.current && !scanRef.current.contains(e.target as Node)) {
        setScanDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      id="top-floating-navigation-capsule"
      aria-label="Website Header Navigation"
      className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-3xl milk-card bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] z-40 transition-all"
    >
      {/* 1. Global Search Bar */}
      <div className="flex-1 max-w-md min-w-[200px]">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, MRN, scan accession, or hash..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 focus:border-amber-500 dark:focus:border-amber-400 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-sans"
          />
        </div>
      </div>

      {/* 2. Middle Controls: Upload/Replace Scan & Active Study Selector */}
      <div className="flex items-center gap-2">
        {/* Upload Scan Action Button */}
        {onOpenUploadScan && (
          <button
            onClick={onOpenUploadScan}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            title="Replace current demo image with your own custom scan"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-900 dark:text-amber-950" />
            <span className="hidden sm:inline">+ Upload / Replace Scan</span>
            <span className="sm:hidden">+ Upload</span>
          </button>
        )}

        {/* Scan Selector Dropdown */}
        <div className="relative" ref={scanRef}>
          <button
            id="active-scan-capsule-button"
            onClick={() => setScanDropdownOpen(!scanDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[130px]">{activeScan.patient.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">({activeScan.accessionNumber.slice(-5)})</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${scanDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {scanDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl milk-card p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-xl z-50 animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Active DICOM Study
              </div>
              <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                {availableScans.map((s) => (
                  <button
                    key={s.scanId}
                    onClick={() => {
                      onSelectScan(s);
                      setScanDropdownOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                      s.scanId === activeScan.scanId
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-700/60'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{s.patient.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.anatomicalRegion}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{s.accessionNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. ZK & Privacy Badge */}
      <button
        id="zk-privacy-badge-button"
        onClick={onOpenZkModal}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
          isBreached
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 ring-2 ring-rose-400/50 shadow-sm'
            : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 shadow-2xs'
        }`}
        title="View Groth16 Zero-Knowledge circuit proofs"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBreached ? 'bg-rose-500' : 'bg-emerald-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isBreached ? 'bg-rose-600' : 'bg-emerald-500'}`} />
        </span>
        <span className="text-xs font-mono font-bold">
          {isBreached ? 'BREACH DETECTED' : 'ZK PROVEN (0 BITS PHI)'}
        </span>
      </button>

      {/* 4. Controls: Theme Toggle, Enclave Auth & Doctor Profile */}
      <div className="flex items-center gap-2">
        {/* Light / Dark Mode Toggle Button */}
        {onToggleTheme && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={onToggleTheme}
            id="theme-mode-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition-colors"
            title={`Toggle Theme (Current: ${theme === 'dark' ? 'Dark' : 'Light'})`}
          >
            {theme === 'dark' ? (
              <motion.div
                initial={{ rotate: -45, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 45, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-slate-700" />
              </motion.div>
            )}
          </motion.button>
        )}

        {onOpenLoginModal && (
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            title="Enclave Login & Hash Key Reference"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Enclave Auth</span>
          </button>
        )}

        {/* Doctor Avatar Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 shadow-2xs transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200 hidden md:inline">{currentUser.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 transition-transform" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl milk-card p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-xl z-50 animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Switch Clinical Persona</div>
              <div className="space-y-1 mt-1">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs flex items-center gap-2 transition-all ${
                      u.id === currentUser.id
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-700/60'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <p className="leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{u.role.replace('_', ' ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
