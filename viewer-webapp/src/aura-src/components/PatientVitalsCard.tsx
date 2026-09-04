import React from 'react';
import { 
  Heart, 
  Wind, 
  Gauge, 
  AlertCircle, 
  Clock, 
  Activity,
  Flame,
  ShieldCheck
} from 'lucide-react';
import type { PatientVitals } from '../types';

interface PatientVitalsCardProps {
  patient: PatientVitals;
}

export const PatientVitalsCard: React.FC<PatientVitalsCardProps> = ({ patient }) => {
  return (
    <div 
      id="patient-intake-card"
      className="p-4 milk-card transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle top specular sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-slate-700 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/40 dark:border-amber-400/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Patient Intake</h3>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{patient.name}</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                {patient.gender}, {patient.age}y
              </span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {patient.triageLevel}
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {patient.admitTime}
          </span>
        </div>
      </div>

      {/* Trauma Mechanism Callout */}
      <div className="mb-3.5 px-3 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-300">Mechanism: </span>
            <span className="text-slate-700 dark:text-slate-300">{patient.traumaMechanism}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{patient.injurySite}</p>
          </div>
        </div>
      </div>

      {/* Minimalist Biometric Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Blood Type */}
        <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xs shrink-0">
            {patient.bloodGroup}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Blood</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{patient.bloodGroup} Rh+</p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <Heart className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Pulse</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{patient.heartRate} <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">bpm</span></p>
          </div>
        </div>

        {/* SpO2 */}
        <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">SpO2</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{patient.spo2}%</p>
          </div>
        </div>

        {/* Pain Score */}
        <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/80 shadow-xs flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Pain</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{patient.painScore}<span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">/10</span></p>
          </div>
        </div>
      </div>

      {/* Zero-Knowledge PHI Scrub Stamp */}
      <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ZK-PHI Blind: SSN & DOB Redacted
        </span>
        <span className="text-slate-400 dark:text-slate-500">ID: {patient.id}</span>
      </div>
    </div>
  );
};
