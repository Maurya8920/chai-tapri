import React, { useState } from 'react';
import { X, Play, Music, Search } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface SongsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SongsModal: React.FC<SongsModalProps> = ({ isOpen, onClose }) => {
  const { playlistIds, currentIndex, isPlaying, playSongAtIndex, getSongMeta } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = playlistIds.map((id, index) => ({
    id,
    index,
    meta: getSongMeta(id),
  })).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.meta.title.toLowerCase().includes(q) ||
      item.meta.author.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-[#140805] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#1c0a06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">
                Chai Tapri Playlist
              </h3>
              <p className="text-xs text-amber-200/70 font-mono">
                {playlistIds.length} Songs Loaded
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-2.5 border-b border-white/10 bg-[#170905]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-white/40 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 90s songs or singers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-amber-400/60"
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-1.5 no-scrollbar">
          {filtered.map(({ id, index, meta }) => {
            const isCurrent = index === currentIndex;

            return (
              <div
                key={id + '-' + index}
                onClick={() => {
                  playSongAtIndex(index);
                }}
                className={`group flex items-center justify-between gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400/60 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-white/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Number / Play status */}
                  <span className="w-6 text-center text-xs font-mono text-white/40 group-hover:text-amber-300 shrink-0">
                    {isCurrent && isPlaying ? (
                      <span className="text-amber-400 text-sm animate-pulse">▶</span>
                    ) : (
                      index + 1
                    )}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    <img
                      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                      alt={meta.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/pwa-192x192.png';
                      }}
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Title & Author */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isCurrent ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {meta.title}
                    </p>
                    <p className="text-[11px] text-white/50 truncate font-mono">
                      Credits: {meta.author}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 pr-1">
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-white/10 text-white/70 group-hover:bg-amber-500/20 group-hover:text-amber-300'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-white/10 bg-[#160805] text-center">
          <p className="text-[11px] text-white/40">
            Playing strictly from public playlist <span className="font-mono text-amber-200/70">PLB6hCBnsas4Q</span>
          </p>
        </div>
      </div>
    </div>
  );
};
