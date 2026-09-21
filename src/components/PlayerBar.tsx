import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/cleanTitle';
import { Volume2, VolumeX } from 'lucide-react';

export const PlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    hasInteracted,
    activeQuote,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
  } = usePlayer();

  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const speakerBtnRef = useRef<HTMLButtonElement | null>(null);

  const displayCurrent = currentTime;
  const pct = duration > 0 ? (displayCurrent / duration) * 100 : 0;

  const thumbnail =
    !imgFailed && currentSong.id
      ? `https://i.ytimg.com/vi/${currentSong.id}/hqdefault.jpg`
      : '/pwa-192x192.png';

  // Clean title on top (or rotating quote before user interaction)
  const titleText = hasInteracted
    ? currentSong.title || '90s Bollywood Song'
    : activeQuote;

  // Credits below it: "Credits: {author_name}"
  const creditsText = hasInteracted
    ? `Credits: ${currentSong.author || 'T-Series'}`
    : 'Credits: 90s Bollywood Radio';

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(clickPct * duration);
  };

  // Speaker button click handler:
  // - If popover is closed, open it.
  // - If popover is open, clicking toggles mute.
  const handleSpeakerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVolumeOpen) {
      setIsVolumeOpen(true);
    } else {
      toggleMute();
    }
  };

  // Close volume popover on outside click or Esc
  useEffect(() => {
    if (!isVolumeOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        speakerBtnRef.current &&
        !speakerBtnRef.current.contains(target)
      ) {
        setIsVolumeOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVolumeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVolumeOpen]);

  return (
    <section
      className="music-player pointer-events-auto select-none w-full"
      aria-label="Chai Tapri 90s Radio Music Player"
    >
      {/* Spinning Circular Vinyl Cover Art - stops in place on pause */}
      <button
        onClick={togglePlay}
        className="music-cover-frame"
        type="button"
        title={isPlaying ? 'Pause' : 'Play'}
        aria-label="Play from cover art"
      >
        <img
          src={thumbnail}
          alt={titleText}
          onError={() => setImgFailed(true)}
          className={`music-cover ${isPlaying ? 'playing' : ''}`}
        />
        <span className="music-cover-hole" aria-hidden="true" />
      </button>

      {/* Song Metadata & Seek Bar */}
      <div className="track-block">
        <div className="track-top">
          <div className="track-name font-semibold" title={titleText}>
            {titleText}
          </div>
        </div>
        <p className="station text-amber-200/75 text-xs font-mono tracking-wide">
          {creditsText}
        </p>

        {/* Progress row */}
        <div className="progress-row">
          <span className="w-8 text-left">{formatTime(displayCurrent)}</span>
          <div
            className="progress"
            onClick={handleProgressBarClick}
            role="slider"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            tabIndex={0}
          >
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-8 text-right">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right-aligned Player Actions: Prev (44px), Play (52px), Next (44px), Speaker (44px) */}
      <div className="player-actions">
        {/* Prev Button (44px, round dark, white ◀ triangle) */}
        <button
          onClick={prevTrack}
          className="player-btn-dark"
          type="button"
          aria-label="Previous song"
          title="Previous song (←)"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
            <polygon points="17,5 7,12 17,19" fill="white" />
          </svg>
        </button>

        {/* Play / Pause Button (52px, amber round button, ▶ when paused, ‖ when playing) */}
        <button
          onClick={togglePlay}
          className="player-btn-play"
          type="button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black shrink-0" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="black" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="black" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black ml-0.5 shrink-0" aria-hidden="true">
              <polygon points="7,5 19,12 7,19" fill="black" />
            </svg>
          )}
        </button>

        {/* Next Button (44px, round dark, white ▶ triangle) */}
        <button
          onClick={nextTrack}
          className="player-btn-dark"
          type="button"
          aria-label="Next song"
          title="Next song (→)"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
            <polygon points="7,5 17,12 7,19" fill="white" />
          </svg>
        </button>

        {/* Volume / Speaker Button with Popover (44px) */}
        <div className="relative flex items-center justify-center">
          {isVolumeOpen && (
            <div
              ref={popoverRef}
              className="volume-popover"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Volume control"
            >
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                }}
                className="amber-slider"
                style={{
                  background: `linear-gradient(to right, #f2a516 0%, #f2a516 ${isMuted ? 0 : volume}%, rgba(255, 255, 255, 0.12) ${isMuted ? 0 : volume}%, rgba(255, 255, 255, 0.12) 100%)`,
                }}
                aria-label="Volume slider"
              />
            </div>
          )}

          <button
            ref={speakerBtnRef}
            onClick={handleSpeakerClick}
            className="player-btn-dark"
            type="button"
            aria-label={isMuted ? 'Unmute' : 'Volume / Mute'}
            title={isMuted ? 'Unmute' : isVolumeOpen ? 'Mute' : 'Volume'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <Volume2 className="w-5 h-5 text-white shrink-0" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
