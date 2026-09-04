import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { HardwareTelemetry } from '../types';

interface TelemetryDetailViewProps {
  telemetry: HardwareTelemetry;
  isBreached: boolean;
}

export const TelemetryDetailView: React.FC<TelemetryDetailViewProps> = ({ telemetry, isBreached }) => {
  const [jitterSamples, setJitterSamples] = useState<number[]>([12.2, 12.5, 12.4, 12.8, 12.1, 12.4, 12.6, 12.3, 12.5]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = Number((12.4 + (Math.random() - 0.5) * 0.6).toFixed(2));
      setJitterSamples(prev => [...prev.slice(1), next]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="telemetry-view" className="p-5 milk-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Edge Hardware Telemetry & Thermal Acoustics</h3>
            <p className="text-xs text-slate-500">Real-time sampling of Apple Neural Engine & Cryptographic Clock Stability</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700">
          ● Live Stream 100Hz
        </span>
      </div>

      {/* Main telemetry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/80 border border-white/95 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CPU Entropy Variance</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-2">
            {telemetry.cpuEntropyVarianceMs} <span className="text-sm font-normal text-slate-500">ms</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Stochastic physical TRNG random seed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-white/95 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>PSNR Reconstruction</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-2">
            {telemetry.psnrDb} <span className="text-sm font-normal text-slate-500">dB</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Noise floor threshold: 110 dB</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-white/95 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Edge AI Latency</span>
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-2">
            {telemetry.edgeInferenceLatencyMs} <span className="text-sm font-normal text-slate-500">ms</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">TPU Core Batch-1 Latency</p>
        </div>
      </div>

      {/* Real-time Oscilloscope Jitter Wave */}
      <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-white/10">
        <div className="flex items-center justify-between mb-2 text-xs font-mono">
          <span className="text-slate-300">Clock Jitter Oscilloscope (PPM vs Milliseconds)</span>
          <span className="text-emerald-400">Δ = 0.18 ppm</span>
        </div>
        <div className="h-28 flex items-end gap-2 pt-4 px-2">
          {jitterSamples.map((val, idx) => {
            const heightPct = Math.min(Math.max(((val - 11.5) / 2) * 100, 15), 95);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </span>
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-amber-400 rounded-t transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
