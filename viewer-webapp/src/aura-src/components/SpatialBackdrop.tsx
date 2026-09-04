import React from 'react';

interface SpatialBackdropProps {
  ambientWarmth?: 'daylight' | 'golden_hour' | 'clinical_pure';
  theme?: 'light' | 'dark';
}

/**
 * Clean, modern web application backdrop matching Image 1:
 * Minimalist, ultra-clean neutral slate in light mode,
 * Sleek, deep obsidian & dark-glass in dark mode.
 * Zero background illustrations, zero floorboards, pure web canvas.
 */
export const SpatialBackdrop: React.FC<SpatialBackdropProps> = ({ 
  ambientWarmth = 'daylight',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Base Studio Web Canvas Gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out"
        style={{
          background: isDark
            ? ambientWarmth === 'golden_hour'
              ? 'linear-gradient(135deg, #100e0b 0%, #18140e 50%, #0c0a08 100%)'
              : ambientWarmth === 'clinical_pure'
              ? 'linear-gradient(135deg, #070a12 0%, #0d1220 50%, #05080e 100%)'
              : 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #070a12 100%)'
            : ambientWarmth === 'golden_hour'
            ? 'linear-gradient(135deg, #f5f2eb 0%, #ece8df 50%, #e3ded5 100%)'
            : ambientWarmth === 'clinical_pure'
            ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
            : 'linear-gradient(135deg, #f0f3f7 0%, #eaedf2 40%, #e2e7ee 100%)'
        }}
      />

      {/* 2. Soft Ambient Lighting Halos for Neumorphic / Glass Depth */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[130px] transition-all duration-700"
        style={{
          opacity: isDark ? 0.22 : 0.4,
          background: isDark
            ? ambientWarmth === 'golden_hour'
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
            : ambientWarmth === 'golden_hour'
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(224, 231, 255, 0.6) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vw] rounded-full blur-[140px] transition-all duration-700"
        style={{
          opacity: isDark ? 0.18 : 0.35,
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(219, 234, 254, 0.5) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute -bottom-[20%] left-[25%] w-[40vw] h-[40vw] rounded-full blur-[130px] transition-all duration-700"
        style={{
          opacity: isDark ? 0.15 : 0.3,
          background: isDark
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(241, 245, 249, 0.8) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};
