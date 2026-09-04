import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import type { HardwareTelemetry, FractureLocalization } from '../types';

interface MetricGaugesCardProps {
  localization: FractureLocalization;
  telemetry: HardwareTelemetry;
  isBreached: boolean;
}

export const MetricGaugesCard: React.FC<MetricGaugesCardProps> = ({
  localization,
  telemetry,
  isBreached
}) => {
  // Animated jitter effect for live hardware realism
  const [liveEntropy, setLiveEntropy] = useState(telemetry.cpuEntropyVarianceMs);
  const [livePsnr, setLivePsnr] = useState(telemetry.psnrDb);

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle micro-jitter
      const deltaEntropy = (Math.random() - 0.5) * 0.4;
      const deltaPsnr = (Math.random() - 0.5) * 0.15;
      setLiveEntropy(Number((telemetry.cpuEntropyVarianceMs + deltaEntropy).toFixed(2)));
      setLivePsnr(Number((telemetry.psnrDb + deltaPsnr).toFixed(2)));
    }, 2800);
    return () => clearInterval(interval);
  }, [telemetry]);

  const confidence = isBreached ? 23.4 : localization.confidence;
  
  // Radial Gauge Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div 
      id="diagnostic-metric-gauges-card"
      className="p-4 milk-card flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/40 dark:border-amber-400/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diagnostic Metrics</h3>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">AI Confidence & Edge Telemetry</h4>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800/60">
            Secure TPU
          </span>
        </div>
      </div>

      {/* Radial Confidence Gauge Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-xs">
        {/* SVG Radial Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(226, 232, 240, 0.8)"
              className="dark:stroke-slate-700"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={isBreached ? "#f43f5e" : "url(#confidenceGradient)"}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {confidence.toFixed(1)}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {isBreached ? 'Compromised' : 'AI Confidence'}
            </span>
          </div>
        </div>

        {/* Gauge Insights Column */}
        <div className="flex-1 min-w-0 space-y-2 text-left">
          <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              <span>Classifier Threshold:</span>
              <span className="font-mono text-amber-700 dark:text-amber-400">&gt; 90.0%</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Exceeds peer-reviewed threshold for surgical reduction recommendations.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/60 font-mono">
            <span className="text-slate-500 dark:text-slate-400">Confidence Band:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isBreached ? '[18.2% - 28.5%]' : '[92.8% - 95.6%]'}
            </span>
          </div>
        </div>
      </div>

      {/* Hardware Jitter Telemetry Card Subsection */}
      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Hardware Jitter Telemetry
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">TPM 2.0 Enclave</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* CPU Entropy Variance */}
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Entropy Variance</span>
              <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {liveEntropy}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ms</span>
            </div>
            <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((liveEntropy / 20) * 100, 100)}%` }} 
              />
            </div>
          </div>

          {/* PSNR Telemetry */}
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span>PSNR Fidelity</span>
              <Activity className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {livePsnr}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">dB</span>
            </div>
            <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((livePsnr / 140) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Additional Edge Latency & Clock Jitter Bar */}
        <div className="mt-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Edge Latency: <strong className="text-slate-800 dark:text-slate-200">{telemetry.edgeInferenceLatencyMs} ms</strong>
          </span>
          <span>
            Clock Jitter: <strong className="text-emerald-700 dark:text-emerald-400">{telemetry.clockJitterPpm} ppm</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
