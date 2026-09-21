import React, { useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none"
      style={{
        backgroundColor: 'rgba(20, 10, 7, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Support the Platform"
    >
      <div
        className="relative w-full max-w-[600px] max-h-[92vh] overflow-y-auto hide-scrollbar bg-[#140a07]/90 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Round "×" close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          type="button"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top: small amber heart icon in a circle */}
        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <Heart className="w-5 h-5 fill-[#f2a516] text-[#f2a516]" />
        </div>

        {/* Heading (bold, white, centred) */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-2.5 max-w-lg mx-auto leading-snug">
          No ads - Just memories. Support the Platform to Stay FOREVER
        </h2>

        {/* Paragraph (grey, centred, max-width 560px) */}
        <p className="text-stone-300/80 text-xs sm:text-sm text-center max-w-[560px] mx-auto leading-relaxed mb-6">
          We promise never to put ads and ruin your experience. But web server costs are high to keep this website smooth. Please send any amount you wish. Thank you in advance! ❤️
        </p>

        {/* White rounded-3xl card (~340px, soft shadow) */}
        <div className="w-full max-w-[340px] max-w-[90vw] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl mx-auto flex flex-col items-center">
          {/* Frame with tricolour border (saffron #d94a3a top, white middle, green #1f7a6a bottom, thick rounded corners) around /support-qr.png */}
          <div
            className="w-full aspect-square max-w-[250px] p-[6px] rounded-2xl shadow-sm"
            style={{
              background: 'linear-gradient(to bottom, #d94a3a 0%, #d94a3a 33.3%, #ffffff 33.3%, #ffffff 66.6%, #1f7a6a 66.6%, #1f7a6a 100%)',
            }}
          >
            <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
              <img
                src="/support-qr.png"
                alt="UPI Support QR"
                className="w-full h-full object-contain p-1"
              />
              {/* Small round tricolour badge overlapping the centre of the QR */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden flex flex-col pointer-events-none"
                aria-hidden="true"
              >
                <div className="flex-1 bg-[#d94a3a]" />
                <div className="flex-1 bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                </div>
                <div className="flex-1 bg-[#1f7a6a]" />
              </div>
            </div>
          </div>

          {/* Under it grey text "UPI · GPay · PhonePe · Paytm" */}
          <p className="text-zinc-500 font-medium text-xs mt-3.5 tracking-wide text-center">
            UPI · GPay · PhonePe · Paytm
          </p>
        </div>

        {/* Below the card: amber pill "⬇ Download QR Code" that downloads /support-qr.png as chai-tapri-upi-qr.png */}
        <div className="flex flex-col items-center mt-6">
          <a
            href="/support-qr.png"
            download="chai-tapri-upi-qr.png"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#f2a516] hover:bg-[#fbbf24] text-black font-semibold text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-base leading-none">⬇</span>
            <span>Download QR Code</span>
          </a>

          {/* Grey caption: Save it and scan with any UPI app. */}
          <p className="text-stone-400 text-[11px] sm:text-xs mt-2.5 text-center">
            Save it and scan with any UPI app.
          </p>

          {/* Grey text link "Dismiss" that closes the modal */}
          <button
            onClick={onClose}
            className="mt-3.5 text-xs text-stone-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            type="button"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
