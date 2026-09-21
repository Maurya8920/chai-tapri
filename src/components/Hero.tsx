import React from 'react';
import { CONFIG } from '../config';
import { PlayerBar } from './PlayerBar';
import { TopNav } from './TopNav';

interface HeroProps {
  isRainActive: boolean;
  onToggleRain: () => void;
  unreadChatCount: number;
  onOpenLiveChat: () => void;
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isRainActive,
  onToggleRain,
  unreadChatCount,
  onOpenLiveChat,
  onOpenSupport,
}) => {
  const handleWhatsAppShare = () => {
    window.open(CONFIG.whatsappShareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative w-full h-[100svh] overflow-hidden select-none">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#120806]">
        <img
          src="/bg-clean.png"
          alt="Chai Tapri 90s Indian Ambiance"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/bg.png';
          }}
        />
        {/* Exact Dark Vignette Overlay from deluxsalon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />
      </div>

      {/* Top Header Navigation */}
      <TopNav onOpenSupport={onOpenSupport} />

      {/* Hero Center Content Container */}
      <main className="absolute inset-0 z-10 flex flex-col items-center justify-between pt-14 pb-3 sm:pt-20 sm:pb-6 px-3 sm:px-6 pointer-events-none">
        {/* Giant White Bold Devanagari Title Display */}
        <div className="pointer-events-auto text-center mt-6 xs:mt-8 sm:mt-0 sm:mb-1">
          <h1 className="font-hindi text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-extrabold tracking-wide text-white leading-[0.88] drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
            चाय<br />टपरी
          </h1>

          {/* Live Chat Pill Button with Unread Count Badge */}
          <button
            onClick={onOpenLiveChat}
            type="button"
            className="relative tweak-pill group border-amber-500/40 text-amber-300 hover:text-amber-100 hover:border-amber-400 cursor-pointer mt-2.5 mx-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-medium tracking-wide">💬 Live Chat</span>
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border border-neutral-900 shadow-md flex items-center justify-center animate-bounce">
                {unreadChatCount > 99 ? '99+' : unreadChatCount}
              </span>
            )}
          </button>
        </div>

        {/* Player & Bottom Controls Stack */}
        <div className="w-full max-w-md xs:max-w-lg sm:max-w-2xl flex flex-col items-center gap-2 sm:gap-3 mt-auto mb-2 sm:my-auto">
          {/* Centered Row of 2 Pills: "Baarish?" and "WhatsApp Share" */}
          <div className="pointer-events-auto flex items-center justify-center gap-2.5 flex-nowrap max-w-full overflow-x-auto no-scrollbar py-1 px-1">
            {/* 1. Baarish toggle: muted dark-blue look when active */}
            <button
              onClick={onToggleRain}
              type="button"
              style={
                isRainActive
                  ? {
                      backgroundColor: 'rgba(38, 52, 110, 0.75)',
                      borderColor: 'rgba(90, 120, 220, 0.6)',
                    }
                  : undefined
              }
              className={`group shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md flex items-center gap-1.5 cursor-pointer select-none transition-colors ${
                isRainActive
                  ? 'text-white'
                  : 'bg-black/45 border-white/20 text-amber-200 hover:border-amber-400/60 hover:text-amber-100'
              }`}
            >
              {isRainActive ? (
                <span style={{ color: '#ffcc33' }} className="text-sm select-none">
                  ⚡
                </span>
              ) : (
                <span className="text-sm select-none">🌧️</span>
              )}
              <span>{isRainActive ? 'Sirf Gaane' : 'Baarish?'}</span>
            </button>

            {/* 2. WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              type="button"
              className="group shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/20 bg-black/45 backdrop-blur-md text-white hover:border-[#25D366]/60 transition-all flex items-center gap-1.5 cursor-pointer select-none"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Share</span>
            </button>
          </div>

          {/* Exact Vintage Music Player Bar */}
          <PlayerBar />
        </div>

        {/* Scroll Cue with Down Arrow */}
        <a
          href="#about"
          className="scroll-cue pointer-events-auto hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-white/60 hover:text-amber-300 transition-colors"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </main>
    </section>
  );
};
