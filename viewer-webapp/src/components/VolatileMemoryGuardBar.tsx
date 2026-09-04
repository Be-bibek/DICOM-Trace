import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Trash2, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

interface VolatileMemoryGuardBarProps {
  isMemoryDumped: boolean;
  onTriggerMemoryDump: () => void;
  onRestoreMemory: () => void;
}

export const VolatileMemoryGuardBar: React.FC<VolatileMemoryGuardBarProps> = ({
  isMemoryDumped,
  onTriggerMemoryDump,
  onRestoreMemory
}) => {
  const [activeStage, setActiveStage] = useState(2); // Canvas blit active by default

  // Cyclic pulse along the memory lifecycle
  useEffect(() => {
    if (isMemoryDumped) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isMemoryDumped]);

  const stages = [
    {
      id: 0,
      label: 'Ciphertext Stream',
      subtext: 'ChaCha20 Encrypted Ingress',
      icon: Lock,
      color: '#5b5fc7'
    },
    {
      id: 1,
      label: 'WASM Linear Heap',
      subtext: 'Isolated Rust-compiled Enclave',
      icon: Cpu,
      color: '#6366f1'
    },
    {
      id: 2,
      label: 'Canvas Blit',
      subtext: 'Framebuffer Raster (39.4 KB)',
      icon: Layers,
      color: '#10b981'
    },
    {
      id: 3,
      label: '0x00 Buffer Purge',
      subtext: 'Explicit Bzero zeroization',
      icon: Trash2,
      color: '#ef4444'
    }
  ];

  return (
    <div 
      id="panel-volatile-memory-guard"
      className="w-full neumo-card p-4 sm:p-5 transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Header of Guard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
              <span>Volatile Memory Guard & Zero-Persistence Enclave</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full neumo-inset-sm text-indigo-800 dark:text-indigo-400 font-bold">
                Cold-Boot Immune
              </span>
            </h3>
            <p className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-medium">
              Zero plain-text DICOM writes to disk. Ephemeral linear memory scrubbed after rendering.
            </p>
          </div>
        </div>

        {/* Action Button: Simulate Memory Breach / Cold-Boot Dump */}
        <div className="flex items-center gap-2">
          {isMemoryDumped ? (
            <button
              type="button"
              id="btn-restore-memory"
              onClick={onRestoreMemory}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 neumo-btn hover:text-emerald-950 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restore Memory Enclave</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-trigger-memory-dump"
              onClick={onTriggerMemoryDump}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-rose-700 dark:text-rose-400 neumo-btn hover:text-rose-800 transition-all active:scale-95"
              title="Simulate sudden hardware memory probe or power interruption"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Memory Breach / Cold-Boot Dump</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-Stage Lifecycle Track: Neumorphic Inset Plate with Extruded Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id && !isMemoryDumped;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                isMemoryDumped
                  ? 'neumo-inset opacity-50'
                  : isActive
                  ? 'neumo-card-subtle border-l-4 border-l-indigo-700 dark:border-l-indigo-400'
                  : 'neumo-inset'
              }`}
            >
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'neumo-inset text-indigo-700 dark:text-indigo-400' : 'neumo-card-subtle text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 truncate font-mono font-medium">
                  {stage.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
