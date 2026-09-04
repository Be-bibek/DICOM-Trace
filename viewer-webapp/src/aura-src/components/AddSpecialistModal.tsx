import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  KeyRound, 
  Check, 
  Stethoscope, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserProfile } from '../types';

interface AddSpecialistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpecialist: (specialist: UserProfile) => void;
}

export const AddSpecialistModal: React.FC<AddSpecialistModalProps> = ({
  isOpen,
  onClose,
  onAddSpecialist
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'chief_orthopedic' | 'radiologist' | 'trauma_specialist'>('chief_orthopedic');
  const [title, setTitle] = useState('Consultant Hand & Microvascular Surgeon');
  const [institution, setInstitution] = useState('National Center for Bone Reconstruction');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomHex = Math.random().toString(16).substring(2, 8);
    const newSpecialist: UserProfile = {
      id: `spec_${Date.now()}`,
      name: name.trim(),
      role: role,
      title: title.trim(),
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      institution: institution.trim(),
      publicKey: `ed25519:pk_${randomHex}...99a1`
    };

    onAddSpecialist(newSpecialist);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-md rounded-3xl milk-card p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col"
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Specialist to Consensus</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Provision Ed25519 signing key for review</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specialist Full Name & Designation
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Priya Kulkarni, MS Ortho"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 focus:ring-1 focus:ring-amber-400 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Specialty</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 focus:ring-1 focus:ring-amber-400 outline-none text-slate-800 dark:text-slate-100"
                >
                  <option value="chief_orthopedic">Orthopedic / Hand Surgery</option>
                  <option value="radiologist">Musculoskeletal Radiology</option>
                  <option value="trauma_specialist">Trauma & Acute Resuscitation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Position Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-750 focus:ring-1 focus:ring-amber-400 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
                <span>
                  An ephemeral Ed25519 zero-knowledge signing key will be generated and provisioned to the local Secure Enclave.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enroll & Dispatch Key</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
