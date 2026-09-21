import React from 'react';
import { OnlineBadge } from './OnlineBadge';

interface TopNavProps {
  onOpenSupport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSupport }) => {
  return (
    <header className="absolute top-2.5 sm:top-4 left-0 right-0 z-30 px-2.5 xs:px-3 sm:px-6 max-w-7xl mx-auto w-full select-none min-w-0">
      <div className="flex items-start sm:items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 w-full min-w-0">
        {/* 1. Online Counter Badge (Left) - renders only when real presence is available */}
        <OnlineBadge />

        {/* 2. Right side: About, FAQ, Support */}
        <nav
          aria-label="Primary"
          className="flex items-center flex-wrap gap-1.5 xs:gap-2 justify-end ml-auto shrink-0 min-w-0"
        >
          <a
            href="#about"
            className="header-pill top-nav-pill px-3 py-1 text-xs hover:border-amber-400/40 hover:text-amber-200 transition-colors"
          >
            About
          </a>
          <a
            href="#faq"
            className="header-pill top-nav-pill px-3 py-1 text-xs hover:border-amber-400/40 hover:text-amber-200 transition-colors"
          >
            FAQ
          </a>

          {/* Support Button with heart */}
          <button
            onClick={onOpenSupport}
            type="button"
            className="header-pill top-nav-pill px-2.5 xs:px-3 sm:px-3.5 gap-1.5 hover:border-amber-400/50 hover:text-amber-200 cursor-pointer"
          >
            <span className="text-[13px] sm:text-xs text-red-400 animate-pulse shrink-0">❤</span>
            <span className="font-semibold text-white/90 text-[13px] sm:text-xs">Support us</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

