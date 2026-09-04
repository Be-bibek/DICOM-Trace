import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  DatabaseZap, 
  LogOut, 
  Sliders,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import type { Persona } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface DynamicIslandTelemetryProps {
  currentPersona: Persona;
  onLogout: () => void;
  isTampered: boolean;
  isMemoryDumped: boolean;
  onOpenZKDetails?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenShowcase?: () => void;
}

export const DynamicIslandTelemetry: React.FC<DynamicIslandTelemetryProps> = ({
  currentPersona,
  onLogout,
  isTampered,
  isMemoryDumped,
  onOpenZKDetails,
  isDarkMode,
  onToggleTheme,
  onOpenShowcase
}) => {
  const [pulseCounter, setPulseCounter] = useState(0);

  // Subtle real-time entropy tick
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCounter((prev) => (prev + 1) % 100);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full relative z-20 pt-4 pb-2 px-3 sm:px-6">
      {/* Container: Neumorphic Dynamic Island Extruded Pill */}
      <div 
        id="dynamic-island-telemetry"
        className="max-w-7xl mx-auto neumo-card rounded-[24px] sm:rounded-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 transition-colors duration-300"
      >
        {/* Left Section: SentinelMark Brand + Active Persona Pill */}
        <div className="flex items-center gap-3">
          {/* Logo emblem */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-300 dark:border-slate-700">
            <div className="w-8 h-8 rounded-xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white hidden md:inline">
              Sentinel<span className="text-indigo-700 dark:text-indigo-400 font-mono">Mark</span>
            </span>
          </div>

          {/* Active Persona Pill (Claymorphic Avatar Bar) */}
          <div 
            id="active-persona-pill"
            className="flex items-center gap-2.5 py-1 px-3 rounded-full neumo-card-subtle"
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentPersona.avatarColor} text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-xs border border-white/60 dark:border-white/20`}>
              {currentPersona.avatarInitials}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[130px] sm:max-w-[160px] truncate">
                  {currentPersona.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                  [{currentPersona.publicKey.slice(0, 6)}...{currentPersona.publicKey.slice(-4)}]
                </span>
              </div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate">
                {currentPersona.roleTitle}
              </span>
            </div>

            {/* WASM Session Active Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full neumo-inset-sm text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="hidden xs:inline">WASM Enclave</span>
              <span className="xs:hidden">WASM</span>
            </div>
          </div>
        </div>

        {/* Center / Right Section: ZK Ticker + Memory Guard + UI Showcase + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
          {/* ZK-SNARK Live Ticker */}
          <button
            type="button"
            id="zk-snark-ticker-badge"
            onClick={onOpenZKDetails}
            title="Inspect Groth16 ZK-SNARK Bilinear Pairing Proof"
            className={`cursor-pointer transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[11px] font-mono ${
              isTampered
                ? 'neumo-inset text-rose-700 dark:text-rose-400 font-bold'
                : 'neumo-btn hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            {isTampered ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400 shrink-0" />
            )}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">Groth16</span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">119k R1CS</span>
              <span className="text-slate-500">|</span>
              <span className={isTampered ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                {isTampered ? 'CORRUPT' : '0-Leak'}
              </span>
            </div>
          </button>

          {/* Memory Sentinel Status */}
          <div 
            id="memory-sentinel-badge"
            className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[11px] font-mono ${
              isMemoryDumped
                ? 'neumo-inset text-amber-700 dark:text-amber-400 font-bold'
                : 'neumo-card-subtle text-slate-700 dark:text-slate-300 font-medium'
            }`}
          >
            <DatabaseZap className={`w-3.5 h-3.5 ${isMemoryDumped ? 'text-amber-600' : 'text-indigo-700 dark:text-indigo-400'} shrink-0`} />
            <span>
              {isMemoryDumped ? (
                <span>Volatile: 0x00 Purged</span>
              ) : (
                <>RAM: 39.4 KB <span className="text-slate-500">|</span> Disk: 0B</>
              )}
            </span>
          </div>

          {/* SoftwareWOW! UI Showcase Button */}
          {onOpenShowcase && (
            <button
              type="button"
              id="btn-open-ui-showcase"
              onClick={onOpenShowcase}
              title="Open SoftwareWOW! Neumorphic Component Palette"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full neumo-btn text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 transition-all active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">UI Palette</span>
            </button>
          )}

          {/* Neumorphic Theme Toggle Switch (Light / Dark) */}
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={onToggleTheme}
          />

          {/* Switch Persona / Logout */}
          <button
            type="button"
            id="btn-switch-persona"
            onClick={onLogout}
            title="Switch Clinical Persona or Logout"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full neumo-btn text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-indigo-800 dark:hover:text-white transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="hidden sm:inline">Switch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
