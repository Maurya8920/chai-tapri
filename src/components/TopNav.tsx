import React from 'react';
import { OnlineBadge } from './OnlineBadge';

interface TopNavProps {
  onOpenSupport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSupport }) => {
  return (
    <header className="absolute top-2.5 sm:top-4 left-0 right-0 z-30 px-2.5 xs:px-3 sm:px-6 max-w-7xl mx-auto w-full select-none">
      <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 w-full">
        {/* 1. Online Counter Badge (Left) */}
        <div className="header-pill px-2.5 xs:px-3 text-emerald-400 gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <OnlineBadge />
        </div>

        {/* 2. Right side: About, FAQ, Support */}
        <nav aria-label="Primary" className="flex items-center gap-1.5 xs:gap-2 justify-end shrink-0">
          <a href="#about" className="header-pill px-3 py-1 text-xs hover:border-amber-400/40 hover:text-amber-200 transition-colors">
            About
          </a>
          <a href="#faq" className="header-pill px-3 py-1 text-xs hover:border-amber-400/40 hover:text-amber-200 transition-colors">
            FAQ
          </a>

          {/* Support Button with heart */}
          <button
            onClick={onOpenSupport}
            type="button"
            className="header-pill px-2.5 xs:px-3 sm:px-3.5 gap-1.5 hover:border-amber-400/50 hover:text-amber-200 cursor-pointer"
          >
            <span className="text-xs text-red-400 animate-pulse shrink-0">❤️</span>
            <span className="font-semibold text-white/90 text-[11px] xs:text-xs">Support us</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
