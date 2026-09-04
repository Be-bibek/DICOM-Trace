import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Star, 
  Check, 
  Sliders, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

interface NeumorphicShowcaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const NeumorphicShowcaseDrawer: React.FC<NeumorphicShowcaseDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  // State for interactive replica widgets from the reference image
  const [sliderVal, setSliderVal] = useState<number>(65);
  const [switch1, setSwitch1] = useState<boolean>(false);
  const [switch2, setSwitch2] = useState<boolean>(true);
  const [checkedBox, setCheckedBox] = useState<boolean>(true);
  const [selectedRadio, setSelectedRadio] = useState<number>(2);
  const [starred, setStarred] = useState<boolean>(true);
  const [segmentedTab, setSegmentedTab] = useState<'1' | '2'>('1');
  const [dayCounter, setDayCounter] = useState<number>(23);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div 
        id="neumorphic-showcase-modal"
        className="w-full max-w-4xl neumo-card p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative transition-all"
        style={{
          backgroundColor: isDarkMode ? '#161928' : '#e4e7f0',
        }}
      >
        {/* Close Button (Neumorphic Circle Button) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 neumo-circle-btn hover:text-rose-500"
          title="Close UI Palette"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="w-10 h-10 rounded-2xl neumo-inset flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SoftwareWOW! Neumorphic UI Design System</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-700/15 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                {isDarkMode ? 'Dark Clay' : 'Light Clay'}
              </span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Complete interactive component suite matching your soft claymorphic reference design.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1 */}
          <div className="space-y-6">
            
            {/* 1. Dropdown with Subitems (Top-Left of reference image) */}
            <div className="neumo-card-subtle p-4 space-y-2">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between cursor-pointer py-1 text-slate-900 dark:text-slate-200 font-bold text-sm select-none"
              >
                <span>Dropdown</span>
                <ChevronDown className={`w-4 h-4 text-indigo-700 dark:text-indigo-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {dropdownOpen && (
                <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                  <div className="flex items-center justify-between py-2 text-xs text-slate-700 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white cursor-pointer">
                    <span>Subitem 1</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs text-slate-700 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white cursor-pointer">
                    <span>Subitem 2 (DICOM Matrix)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Avatar Card ("Melissa Morillo" style from reference image) */}
            <div className="neumo-card-subtle p-5 relative flex flex-col items-center text-center">
              {/* Plus Button Top-Right */}
              <button 
                type="button" 
                className="absolute top-4 right-4 w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-slate-700 dark:text-slate-400 hover:text-indigo-700 font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Circular Avatar Photo with White Ring */}
              <div className="w-16 h-16 rounded-full p-1 neumo-card mb-3 bg-white/60 dark:bg-white/10 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Melissa Morillo"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Melissa Morillo
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Lead Radiologic Researcher
              </p>
            </div>

            {/* 3. Date Counter Card (< 23 > Monday) + Plus button */}
            <div className="neumo-card-subtle p-5 flex flex-col items-center max-w-[200px] mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <button 
                  type="button"
                  onClick={() => setDayCounter(prev => Math.max(1, prev - 1))}
                  className="text-slate-600 hover:text-slate-950 dark:hover:text-slate-200 text-sm font-bold"
                >
                  &lt;
                </button>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {dayCounter}
                </span>
                <button 
                  type="button"
                  onClick={() => setDayCounter(prev => prev + 1)}
                  className="text-slate-600 hover:text-slate-950 dark:hover:text-slate-200 text-sm font-bold"
                >
                  &gt;
                </button>
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-3">Monday</span>

              <div className="w-full pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 flex justify-center">
                <button 
                  type="button"
                  className="w-16 h-8 rounded-full neumo-btn text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. 3D Geometric Soft Shapes (Triangle, Square, Circle, Hexagon from bottom) */}
            <div className="flex items-center justify-around p-3 neumo-inset">
              {/* Cone / Triangle */}
              <div className="w-8 h-8 rounded-md neumo-btn flex items-center justify-center text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                ▲
              </div>
              {/* Square / Cube */}
              <div className="w-8 h-8 rounded-lg neumo-btn flex items-center justify-center text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                ■
              </div>
              {/* Circle / Sphere */}
              <div className="w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                ●
              </div>
              {/* Hexagon */}
              <div className="w-8 h-8 rounded-md neumo-btn flex items-center justify-center text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                ⬡
              </div>
            </div>

          </div>

          {/* COLUMN 2 */}
          <div className="space-y-6">

            {/* 1. Horizontal Slider with Round Knob */}
            <div className="neumo-card-subtle p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold">Continuous Soft Slider</span>
                <span className="font-mono text-indigo-800 dark:text-indigo-400 font-bold">{sliderVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="neumo-slider py-2"
              />
            </div>

            {/* 2. Switches & Checkboxes Row */}
            <div className="neumo-card-subtle p-4 space-y-4">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-300">
                Tactile Clay Toggles & Radios
              </div>
              
              {/* Switches */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">Inactive Toggle</span>
                <div 
                  onClick={() => setSwitch1(!switch1)}
                  className={`neumo-switch-track ${switch1 ? 'neumo-switch-active' : ''}`}
                >
                  <div className="neumo-switch-thumb">
                    {switch1 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-700 dark:bg-indigo-400" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">Active Soft Blue Toggle</span>
                <div 
                  onClick={() => setSwitch2(!switch2)}
                  className={`neumo-switch-track ${switch2 ? 'neumo-switch-active' : ''}`}
                >
                  <div className="neumo-switch-thumb">
                    {switch2 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-700 dark:bg-indigo-400" />}
                  </div>
                </div>
              </div>

              {/* Checkboxes & Radios Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-300 dark:border-slate-800">
                <div 
                  onClick={() => setCheckedBox(!checkedBox)}
                  className="w-7 h-7 rounded-full neumo-inset flex items-center justify-center cursor-pointer text-indigo-700 dark:text-indigo-400"
                >
                  {checkedBox && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div 
                  onClick={() => setSelectedRadio(1)}
                  className="w-7 h-7 rounded-full neumo-inset flex items-center justify-center cursor-pointer"
                >
                  {selectedRadio === 1 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-700 dark:bg-indigo-400" />}
                </div>

                <div 
                  onClick={() => setSelectedRadio(2)}
                  className="w-7 h-7 rounded-full neumo-inset flex items-center justify-center cursor-pointer"
                >
                  {selectedRadio === 2 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-700 dark:bg-indigo-400" />}
                </div>

                <div 
                  onClick={() => setSelectedRadio(3)}
                  className="w-7 h-7 rounded-full neumo-inset flex items-center justify-center cursor-pointer"
                >
                  {selectedRadio === 3 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-700 dark:bg-indigo-400" />}
                </div>
              </div>
            </div>

            {/* 3. Rounded Square Buttons & Stars Row */}
            <div className="flex items-center justify-between gap-3">
              <button type="button" className="w-11 h-11 rounded-2xl neumo-btn text-slate-700 hover:text-slate-950 dark:hover:text-white">
                <ChevronLeft className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
              </button>

              <button type="button" className="w-11 h-11 rounded-2xl neumo-btn text-slate-700 hover:text-slate-950 dark:hover:text-white">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>

              <button 
                type="button" 
                onClick={() => setStarred(!starred)}
                className="w-11 h-11 rounded-2xl neumo-btn text-indigo-700 dark:text-indigo-400"
              >
                <Star className={`w-5 h-5 ${starred ? 'fill-indigo-700 dark:fill-indigo-400' : ''}`} />
              </button>

              <button type="button" className="w-11 h-11 rounded-2xl neumo-btn text-slate-500">
                <Star className="w-5 h-5" />
              </button>
            </div>

            {/* 4. Action Buttons (Standard, Pressed, Disabled) */}
            <div className="space-y-3">
              <button 
                type="button"
                className="w-full py-3 rounded-2xl neumo-btn text-sm font-bold text-slate-900 dark:text-slate-100"
              >
                Button
              </button>

              <button 
                type="button"
                className="w-full py-3 rounded-2xl neumo-pressed text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                Pressed
              </button>

              <button 
                type="button"
                disabled
                className="w-full py-3 rounded-2xl bg-black/5 dark:bg-white/5 opacity-50 cursor-not-allowed text-sm font-medium text-slate-500 dark:text-slate-500"
              >
                Disabled
              </button>
            </div>

            {/* 5. Segmented Switch [1 | 2], Tooltip, and Circular Progress 85 */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {/* Segmented Control */}
              <div className="p-1 neumo-inset rounded-full flex items-center">
                <button
                  type="button"
                  onClick={() => setSegmentedTab('1')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    segmentedTab === '1'
                      ? 'neumo-card-subtle text-[#5b5fc7] dark:text-indigo-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setSegmentedTab('2')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    segmentedTab === '2'
                      ? 'neumo-card-subtle text-[#5b5fc7] dark:text-indigo-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  2
                </button>
              </div>

              {/* Tooltip Bubble */}
              <div className="neumo-tooltip">
                Tooltip
              </div>

              {/* Circular 85 Gauge */}
              <div className="relative w-12 h-12 rounded-full neumo-card-subtle flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
                  <path
                    className="text-slate-300 dark:text-slate-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#5b5fc7] dark:text-indigo-400"
                    strokeDasharray="85, 100"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span>85</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info badge */}
        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5b5fc7] dark:text-indigo-400" />
            <span>Harmonized with Clinical SentinelMark Zero-Trust Architecture</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 font-semibold tracking-wider">
            SOFTWARE<span className="text-[#5b5fc7] dark:text-indigo-400 font-bold">WOW!</span>
          </span>
        </div>
      </div>
    </div>
  );
};
