import React from 'react';

interface AmbientBackdropProps {
  isDarkMode?: boolean;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({ isDarkMode = false }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500 ${
      isDarkMode ? 'bg-[#141724]' : 'bg-[#e4e7f0]'
    }`}>
      {/* Ambient Grid overlay for subtle tactile grain */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`
            : `radial-gradient(circle at 1px 1px, rgba(91,95,199,0.7) 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {isDarkMode ? (
        <>
          {/* Dark Mode Ambient Blur Sphere 1: Deep Indigo / Violet */}
          <div 
            className="absolute -top-24 -left-20 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-900/30 via-purple-900/25 to-blue-900/20 blur-[130px] animate-float-slow"
          />

          {/* Dark Mode Ambient Blur Sphere 2: Pure Cyan Glow */}
          <div 
            className="absolute top-1/4 -right-24 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-cyan-900/25 via-blue-950/30 to-indigo-900/25 blur-[140px] animate-float-reverse"
          />

          {/* Dark Mode Ambient Blur Sphere 3: Deep Slate Violet */}
          <div 
            className="absolute -bottom-36 left-1/3 w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-violet-950/30 via-purple-900/20 to-slate-900/30 blur-[150px] animate-float-slow"
          />
        </>
      ) : (
        <>
          {/* Light Mode Soft Clay Halo 1: Lavender Pearl */}
          <div 
            className="absolute -top-24 -left-20 w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-indigo-200/35 via-purple-200/25 to-blue-200/20 blur-[110px] animate-float-slow"
          />

          {/* Light Mode Soft Clay Halo 2: Soft Sky Mist */}
          <div 
            className="absolute top-1/3 -right-24 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-blue-200/30 via-indigo-100/35 to-purple-200/20 blur-[120px] animate-float-reverse"
          />

          {/* Light Mode Soft Clay Halo 3: Peach / Lilac Warmth */}
          <div 
            className="absolute -bottom-36 left-1/4 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-rose-100/25 via-indigo-100/30 to-slate-200/30 blur-[130px] animate-float-slow"
          />
        </>
      )}
    </div>
  );
};
