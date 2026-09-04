import React from 'react';
import { Sliders, Sun, Moon, Eye, Volume2, ShieldCheck, Sparkles, Monitor } from 'lucide-react';

interface SettingsViewProps {
  ambientWarmth: 'daylight' | 'golden_hour' | 'clinical_pure';
  onChangeWarmth: (w: 'daylight' | 'golden_hour' | 'clinical_pure') => void;
  theme: 'light' | 'dark';
  onChangeTheme: (t: 'light' | 'dark') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  ambientWarmth, 
  onChangeWarmth,
  theme,
  onChangeTheme
}) => {
  return (
    <div id="settings-view" className="p-5 milk-card space-y-4 max-w-2xl mx-auto border border-white/80 dark:border-slate-800">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-400/40 dark:border-amber-400/30 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">VisionOS Spatial Optics & Zero-Trust Preferences</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Environmental light refraction, glass specular opacity & cryptographic threshold</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Appearance & Color Mode Switcher */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/95 dark:border-slate-700/80 shadow-xs">
          <label className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <Monitor className="w-4 h-4 text-amber-500" />
            <span>Display Theme (Light & Dark Mode)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="settings-theme-light"
              onClick={() => onChangeTheme('light')}
              className={`p-3 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                theme === 'light'
                  ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-750 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Spatial Light Milk Glass</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">High-contrast daytime clinic environment</p>
              </div>
            </button>

            <button
              type="button"
              id="settings-theme-dark"
              onClick={() => onChangeTheme('dark')}
              className={`p-3 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                theme === 'dark'
                  ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-750 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Obsidian Deep Glass</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Radiology darkroom & eye-comfort mode</p>
              </div>
            </button>
          </div>
        </div>

        {/* Environmental Lighting Preset */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/95 dark:border-slate-700/80 shadow-xs">
          <label className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Spatial Room Atmosphere Preset</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'daylight' as const, label: 'Natural Daylight', desc: 'Warm ivory & soft sky' },
              { id: 'golden_hour' as const, label: 'Golden Amber', desc: 'Evening clinic warmth' },
              { id: 'clinical_pure' as const, label: 'Pure Surgical', desc: 'High-contrast clean tone' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onChangeWarmth(p.id)}
                className={`p-3 rounded-xl text-left transition-all ${
                  ambientWarmth === p.id
                    ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-750 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="font-semibold text-slate-900 dark:text-white">{p.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Glass Refraction Specs */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/95 dark:border-slate-700/80 shadow-xs space-y-2">
          <label className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>VisionOS Spatial Materials Engine</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500">Master Canvas Blur:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">32px Backdrop Blur</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500">Inner Milk Blur:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">16px Translucent</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500">Specular Highlight:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">1px Inset Glass Rim</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500">Edge Radius:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">36px Window / 24px Cards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
