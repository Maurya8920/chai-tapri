import React, { useState, useEffect, useCallback } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Hero } from './components/Hero';
import { BelowHero } from './components/BelowHero';
import { RainEngine } from './components/RainEngine';
import { LiveChatModal } from './components/LiveChatModal';
import { SupportModal } from './components/SupportModal';

export const AppContent: React.FC = () => {
  const { blockedToast } = usePlayer();
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Auto handle hash routes like #about or #faq
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  const handleOpenLiveChat = useCallback(() => {
    setIsLiveChatOpen(true);
    setUnreadChatCount(0);
  }, []);

  const handleCloseLiveChat = useCallback(() => {
    setIsLiveChatOpen(false);
  }, []);

  const handleNewIncomingChatMessage = useCallback(() => {
    if (!isLiveChatOpen) {
      setUnreadChatCount((prev) => prev + 1);
    }
  }, [isLiveChatOpen]);

  return (
    <div className="relative w-full min-h-screen bg-[#120806] text-white selection:bg-amber-500/40">
      {/* Toast Notification for Blocked / Label Restricted Songs */}
      {blockedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-amber-500/60 text-amber-200 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>{blockedToast}</span>
        </div>
      )}

      {/* Off-screen continuous YouTube IFrame Player (100% hidden, audio keeps playing) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '200px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -10,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div id="youtubeBridge" />
      </div>

      {/* Atmospheric Rain & Lightning Engine */}
      <RainEngine isActive={isRainActive} />

      {/* Hero Section */}
      <Hero
        isRainActive={isRainActive}
        onToggleRain={() => setIsRainActive((prev) => !prev)}
        unreadChatCount={unreadChatCount}
        onOpenLiveChat={handleOpenLiveChat}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Crawlable Content Below Hero (About, FAQ, Footer) */}
      <BelowHero />

      {/* Modals */}
      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={handleCloseLiveChat}
        onNewMessage={handleNewIncomingChatMessage}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
