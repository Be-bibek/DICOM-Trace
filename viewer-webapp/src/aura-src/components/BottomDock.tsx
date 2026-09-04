import React from 'react';
import { 
  FolderArchive, 
  Bone, 
  Scan, 
  Activity, 
  FileCode, 
  UserPlus,
  Sparkles
} from 'lucide-react';
import { DepartmentFilter } from '../types';

interface BottomDockProps {
  activeFilter: DepartmentFilter;
  onSelectFilter: (filter: DepartmentFilter) => void;
  onOpenZkLedger: () => void;
  onOpenAddSpecialist: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeFilter,
  onSelectFilter,
  onOpenZkLedger,
  onOpenAddSpecialist
}) => {
  const filterPills: { id: DepartmentFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'All Records', label: 'All Records', icon: FolderArchive },
    { id: 'Orthopedics', label: 'Orthopedics', icon: Bone },
    { id: 'Radiology', label: 'Radiology', icon: Scan },
    { id: 'Trauma Unit', label: 'Trauma Unit', icon: Activity },
    { id: 'ZK Proof Ledger', label: 'ZK Proof Ledger', icon: FileCode },
  ];

  return (
    <footer 
      id="bottom-floating-department-dock"
      aria-label="Department Filter Dock"
      className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full glass-pill bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_12px_36px_rgba(100,80,60,0.12),inset_0_1px_1px_rgba(255,255,255,1)] z-40 transition-all"
    >
      {filterPills.map((pill) => {
        const Icon = pill.icon;
        const isActive = activeFilter === pill.id;

        return (
          <button
            key={pill.id}
            id={`filter-pill-${pill.id.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => {
              if (pill.id === 'ZK Proof Ledger') {
                onOpenZkLedger();
              } else {
                onSelectFilter(pill.id);
              }
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-slate-900 text-white shadow-[0_4px_12px_rgba(15,23,42,0.25)] ring-1 ring-slate-950'
                : 'bg-white/70 hover:bg-white text-slate-700 hover:text-slate-900 border border-white/80'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{pill.label}</span>
          </button>
        );
      })}

      <div className="w-[1px] h-5 bg-slate-300/60 mx-1 hidden sm:block" />

      {/* + Add Specialist Action Pill */}
      <button
        id="btn-add-specialist"
        onClick={onOpenAddSpecialist}
        className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/60 shadow-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95"
      >
        <UserPlus className="w-3.5 h-3.5 text-amber-700" />
        <span>+ Add Specialist</span>
      </button>
    </footer>
  );
};
