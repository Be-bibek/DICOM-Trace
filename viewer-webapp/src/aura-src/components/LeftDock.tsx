import React from 'react';
import { 
  LayoutDashboard,
  ScanLine, 
  FolderArchive,
  GitFork, 
  Binary,
  KeyRound, 
  FileText,
  Sliders, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

export type LeftNavTab = 
  | 'overview' 
  | 'scanner' 
  | 'studies' 
  | 'dag' 
  | 'zkledger' 
  | 'vault' 
  | 'reports' 
  | 'settings';

interface LeftDockProps {
  activeTab: LeftNavTab;
  onSelectTab: (tab: LeftNavTab) => void;
  isBreached: boolean;
  currentUser?: UserProfile;
  onOpenLoginModal?: () => void;
}

export const LeftDock: React.FC<LeftDockProps> = ({ 
  activeTab, 
  onSelectTab, 
  isBreached,
  currentUser,
  onOpenLoginModal
}) => {
  const navItems = [
    { id: 'overview' as LeftNavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'scanner' as LeftNavTab, label: 'Diagnostic Suite', icon: ScanLine },
    { id: 'studies' as LeftNavTab, label: 'Studies Archive', icon: FolderArchive },
    { id: 'dag' as LeftNavTab, label: 'Consensus DAG', icon: GitFork },
    { id: 'zkledger' as LeftNavTab, label: 'ZK Proof Ledger', icon: Binary },
    { id: 'vault' as LeftNavTab, label: 'Key Vault', icon: KeyRound },
    { id: 'reports' as LeftNavTab, label: 'Clinical Reports', icon: FileText },
    { id: 'settings' as LeftNavTab, label: 'Settings', icon: Sliders },
  ];

  return (
    <aside 
      id="left-vertical-dock"
      aria-label="Website Navigation Sidebar"
      className="w-full md:w-60 lg:w-64 flex flex-col justify-between p-3.5 rounded-3xl milk-card bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] z-30 transition-all duration-300"
    >
      {/* Top Brand Block */}
      <div>
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
              isBreached 
                ? 'bg-rose-500/20 text-rose-600 ring-2 ring-rose-400 animate-pulse' 
                : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              SentinelMark
            </h1>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
              Zero-Trust Health OS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-200/70 dark:bg-slate-800 mb-3" />

        {/* Navigation links list */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={item.id}
                id={`left-dock-btn-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`relative group w-full px-3 py-2 rounded-2xl flex items-center justify-between text-xs font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockIndicator"
                    className="absolute inset-0 bg-slate-900 dark:bg-amber-400 rounded-2xl -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-2.5 min-w-0 z-10">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive 
                      ? 'text-amber-400 dark:text-slate-950' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-slate-950 shrink-0 z-10" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Enclave Auth Capsule */}
      <div className="pt-3 border-t border-slate-200/70 dark:bg-transparent dark:border-slate-800 mt-4">
        {currentUser ? (
          <div className="p-2 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                title="Switch Doctor / Enclave Auth"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : onOpenLoginModal ? (
          <button
            onClick={onOpenLoginModal}
            className="w-full py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
            <span>Enclave Sign In</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
};
