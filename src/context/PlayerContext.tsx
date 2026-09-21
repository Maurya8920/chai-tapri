import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { CONFIG } from '../config';
import initialPlaylistIds from '../data/playlist-ids.json';
import prefetchedMeta from '../data/prefetched-songs.json';
import referenceSongs from '../data/chai-tapri-songs.json';
import { cleanSongTitle } from '../utils/cleanTitle';
import type { YTPlayer } from '../types/youtube';

export interface CurrentSongState {
  id: string;
  title: string;
  author: string;
}

interface PlayerContextType {
  currentSong: CurrentSongState;
  currentIndex: number;
  totalSongs: number;
  playlistIds: string[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  hasInteracted: boolean;
  activeQuote: string;
  blockedToast: string | null;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (sec: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  playSongAtIndex: (index: number) => void;
  getSongMeta: (id: string) => { title: string; author: string };
}

const CHAIWALA_QUOTES = [
  "Ek cutting aur, phir kaam pe chalte hain.",
  "Adrak wali chai, doodh kam.",
  "Bhaiya, biscuit bhi dena.",
  "Gaana chalu hai, chai garam hai.",
  "Chai ki chuski, purane nagme.",
  "Zindagi aur chai, dono kadak honi chahiye."
];

const COMPILATION_TERMS = [
  'jukebox',
  'nonstop',
  'all songs',
  'back to back',
  'mashup',
  '1 hour'
];

const CACHE_PREFIX = 'ct_meta_';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cleanAndMatchTitle(rawTitle: string): string {
  if (!rawTitle || rawTitle.trim() === '') return '90s Hit Song';
  const cleaned = cleanSongTitle(rawTitle).title;
  if (!cleaned) return '90s Hit Song';

  const lowerCleaned = cleaned.toLowerCase();
  const match = (referenceSongs as Array<{ title: string }>).find((s) => {
    const sLower = s.title.toLowerCase();
    return lowerCleaned.includes(sLower) || sLower.includes(lowerCleaned);
  });

  if (match && match.title) {
    return match.title;
  }
  return cleaned;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All 57 songs from user's playlist PLB6hCBnsas4Q
  const [playlistIds, setPlaylistIds] = useState<string[]>(() => {
    return Array.isArray(initialPlaylistIds) && initialPlaylistIds.length > 0
      ? initialPlaylistIds
      : [];
  });

  // Random initial start index (0 ... N-1)
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const len = initialPlaylistIds.length || 1;
    return Math.floor(Math.random() * len);
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chai_player_volume');
      if (saved !== null) {
        const val = Number(saved);
        if (!isNaN(val) && val >= 0 && val <= 100) return val;
      }
    } catch (e) {
      // ignore
    }
    return 80;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chai_player_volume');
      if (saved !== null && Number(saved) === 0) return true;
    } catch (e) {
      // ignore
    }
    return false;
  });
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [activeQuote, setActiveQuote] = useState<string>(CHAIWALA_QUOTES[0]);
  const [blockedToast, setBlockedToast] = useState<string | null>(null);

  const playerRef = useRef<YTPlayer | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const isApiLoadedRef = useRef<boolean>(false);
  const isCheckingCompilationRef = useRef<boolean>(false);
  const userInitiatedPauseRef = useRef<boolean>(false);
  const autoResumeTimerRef = useRef<number | null>(null);

  const playlistIdsRef = useRef<string[]>(playlistIds);
  const currentIndexRef = useRef<number>(currentIndex);

  useEffect(() => {
    playlistIdsRef.current = playlistIds;
  }, [playlistIds]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);


  // Synchronous metadata resolver with 7-day localStorage cache
  const getSongMeta = useCallback((id: string): { title: string; author: string } => {
    if (!id) return { title: '90s Hit Song', author: 'Retro Bollywood' };

    // 1. Check localStorage
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + id);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < SEVEN_DAYS_MS && parsed.title) {
          return {
            title: cleanAndMatchTitle(parsed.title),
            author: parsed.author || 'T-Series',
          };
        }
      }
    } catch (e) {
      // ignore
    }

    // 2. Check prefetched dictionary
    const metaMap = prefetchedMeta as Record<string, { title?: string; author?: string }>;
    if (metaMap[id] && metaMap[id].title) {
      const entry = {
        title: cleanAndMatchTitle(metaMap[id].title || ''),
        author: metaMap[id].author || 'T-Series',
      };
      try {
        localStorage.setItem(
          CACHE_PREFIX + id,
          JSON.stringify({ ...entry, timestamp: Date.now() })
        );
      } catch (e) {
        // ignore
      }
      return entry;
    }

    return { title: '90s Hit Song', author: 'Retro Bollywood' };
  }, []);

  const currentId = playlistIds[currentIndex] || playlistIds[0] || 'KeyfUuXPOcY';

  const [currentSong, setCurrentSong] = useState<CurrentSongState>(() => {
    const meta = getSongMeta(currentId);
    return {
      id: currentId,
      title: meta.title,
      author: meta.author,
    };
  });

  // Update currentSong state immediately without blocking playback
  useEffect(() => {
    const id = playlistIds[currentIndex] || playlistIds[0];
    if (!id) return;
    const meta = getSongMeta(id);
    setCurrentSong({
      id,
      title: meta.title,
      author: meta.author,
    });

    // Asynchronous background fetch to refresh cache if missing
    const cached = localStorage.getItem(CACHE_PREFIX + id);
    if (!cached) {
      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.title) {
            const entry = {
              title: d.title,
              author: d.author_name || 'Bollywood Music',
              timestamp: Date.now(),
            };
            try {
              localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(entry));
            } catch (e) {
              // ignore
            }
            if (id === playlistIdsRef.current[currentIndexRef.current]) {
              setCurrentSong({
                id,
                title: cleanAndMatchTitle(entry.title),
                author: entry.author,
              });
            }
          }
        })
        .catch(() => {
          // fail silently
        });
    }
  }, [currentIndex, playlistIds, getSongMeta]);

  // Rotate quotes before interaction
  useEffect(() => {
    if (hasInteracted) return;
    let quoteIdx = 0;
    const interval = setInterval(() => {
      quoteIdx = (quoteIdx + 1) % CHAIWALA_QUOTES.length;
      setActiveQuote(CHAIWALA_QUOTES[quoteIdx]);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasInteracted]);

  const stopProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  // Compilation guard
  const checkCompilationGuard = useCallback((): boolean => {
    if (!playerRef.current || isCheckingCompilationRef.current) return false;
    try {
      const dur = playerRef.current.getDuration() || 0;
      const videoData = playerRef.current.getVideoData?.() || {};
      const ytTitle = (videoData.title || '').toLowerCase();
      const isCompilationTitle = COMPILATION_TERMS.some((term) => ytTitle.includes(term));

      if ((dur > 0 && dur > 720) || isCompilationTitle) {
        console.log('skipped: compilation', { title: ytTitle, duration: dur });
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
    return false;
  }, []);

  // Play video by index immediately without blocking
  const playSongAtIndex = useCallback((index: number) => {
    const list = playlistIdsRef.current;
    if (list.length === 0) return;
    const clamped = Math.max(0, Math.min(index, list.length - 1));
    userInitiatedPauseRef.current = false;
    if (autoResumeTimerRef.current) {
      clearTimeout(autoResumeTimerRef.current);
      autoResumeTimerRef.current = null;
    }
    setCurrentIndex(clamped);
    setCurrentTime(0);
    setDuration(0);
    const id = list[clamped];
    setHasInteracted(true);
    setIsPlaying(true);
    if (playerRef.current && id) {
      try {
        playerRef.current.unMute();
        playerRef.current.loadVideoById(id);
      } catch (e) {
        console.warn('Error loading video by id:', e);
      }
    }
  }, []);

  // Next Track: cycles sequentially 0 ... N-1, wraps at N
  const nextTrackInternal = useCallback(() => {
    userInitiatedPauseRef.current = false;
    const list = playlistIdsRef.current;
    if (list.length === 0) return;
    const nextIdx = (currentIndexRef.current + 1) % list.length;
    playSongAtIndex(nextIdx);
  }, [playSongAtIndex]);

  // Previous Track
  const prevTrackInternal = useCallback(() => {
    userInitiatedPauseRef.current = false;
    if (currentTime > 4 && playerRef.current) {
      playerRef.current.seekTo(0, true);
      setCurrentTime(0);
      return;
    }
    const list = playlistIdsRef.current;
    if (list.length === 0) return;
    const prevIdx = (currentIndexRef.current - 1 + list.length) % list.length;
    playSongAtIndex(prevIdx);
  }, [currentTime, playSongAtIndex]);

  const startProgress = useCallback(() => {
    stopProgress();
    progressTimerRef.current = window.setInterval(() => {
      if (!playerRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || 0;
        setCurrentTime(cur);
        if (dur > 0) {
          setDuration(dur);
          if (dur > 720 && !isCheckingCompilationRef.current) {
            isCheckingCompilationRef.current = true;
            console.log('skipped: compilation (duration > 720s)');
            nextTrackInternal();
            setTimeout(() => {
              isCheckingCompilationRef.current = false;
            }, 1500);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
    }, 500);
  }, [nextTrackInternal, stopProgress]);

  // Poll playlist IDs with retry until count stops growing or reaches 57
  const pollPlaylistIds = useCallback(() => {
    let retries = 0;
    let lastCount = playlistIdsRef.current.length;

    const poll = () => {
      if (!playerRef.current) return;
      try {
        const list = playerRef.current.getPlaylist();
        if (list && Array.isArray(list) && list.length > 0) {
          if (list.length >= lastCount) {
            lastCount = list.length;
            setPlaylistIds(list);
            playlistIdsRef.current = list;
          }
          if (list.length >= 57 || retries >= 10) {
            console.log(`playlist loaded: ${list.length} songs`);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      retries++;
      if (retries < 10) {
        setTimeout(poll, 500);
      } else {
        console.log(`playlist loaded: ${playlistIdsRef.current.length} songs`);
      }
    };

    poll();
  }, []);

  // YouTube Player setup
  useEffect(() => {
    console.log(`playlist loaded: ${initialPlaylistIds.length} songs`);

    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    if (!isApiLoadedRef.current) {
      isApiLoadedRef.current = true;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    function initPlayer() {
      if (playerRef.current) return;
      const bridge = document.getElementById('youtubeBridge');
      if (!bridge) return;

      playerRef.current = new window.YT.Player('youtubeBridge', {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            try {
              const saved = localStorage.getItem('chai_player_volume');
              const initVol = saved !== null && !isNaN(Number(saved)) ? Math.max(0, Math.min(100, Number(saved))) : 80;
              event.target.setVolume(initVol);
              if (initVol === 0) {
                event.target.mute();
                setIsMuted(true);
              }
              // Cue user playlist once on app start
              event.target.cuePlaylist({ listType: 'playlist', list: CONFIG.playlistId });
              setTimeout(pollPlaylistIds, 600);
            } catch (e) {
              console.warn(e);
            }
          },
          onStateChange: (event) => {
            // State 5: CUED -> read getPlaylist() with retry
            if (event.data === window.YT.PlayerState.CUED || event.data === 5) {
              pollPlaylistIds();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              userInitiatedPauseRef.current = false;
              if (autoResumeTimerRef.current) {
                clearTimeout(autoResumeTimerRef.current);
                autoResumeTimerRef.current = null;
              }
              setIsPlaying(true);
              startProgress();

              try {
                const videoData = playerRef.current?.getVideoData?.();
                if (videoData?.author) {
                  setCurrentSong((prev) => ({
                    ...prev,
                    author: videoData.author,
                  }));
                }
              } catch (e) {
                // ignore
              }

              if (checkCompilationGuard()) {
                nextTrackInternal();
                return;
              }
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgress();

              // Auto-resume: if the player fires PAUSED while document.hidden is true
              // and the user did not press pause, call playVideo() once after 300 ms
              if (autoResumeTimerRef.current) {
                clearTimeout(autoResumeTimerRef.current);
                autoResumeTimerRef.current = null;
              }

              if (document.hidden && !userInitiatedPauseRef.current) {
                autoResumeTimerRef.current = window.setTimeout(() => {
                  if (document.hidden && !userInitiatedPauseRef.current && playerRef.current) {
                    try {
                      playerRef.current.playVideo();
                    } catch (e) {
                      console.warn('Auto-resume failed:', e);
                    }
                  }
                }, 300);
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              userInitiatedPauseRef.current = false;
              // Next song only on ENDED
              nextTrackInternal();
            }
          },
          onError: (event) => {
            const errCode = event.data;
            const id = playlistIdsRef.current[currentIndexRef.current] || '';
            const t = currentSong.title;
            if (errCode === 101 || errCode === 150) {
              console.log(`blocked: ${id} ${t}`);
              setBlockedToast('Song blocked by label, skipping');
              setTimeout(() => {
                setBlockedToast(null);
              }, 3000);
            }
            nextTrackInternal();
          },
        },
      });
    }

    return () => {
      stopProgress();
      if (autoResumeTimerRef.current) {
        clearTimeout(autoResumeTimerRef.current);
        autoResumeTimerRef.current = null;
      }
    };
  }, [checkCompilationGuard, currentSong.title, nextTrackInternal, pollPlaylistIds, startProgress, stopProgress]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;

    if (!hasInteracted) {
      userInitiatedPauseRef.current = false;
      setHasInteracted(true);
      const id = playlistIdsRef.current[currentIndexRef.current];
      if (id) {
        try {
          playerRef.current.unMute();
          playerRef.current.loadVideoById(id);
          setIsPlaying(true);
        } catch (e) {
          console.warn(e);
        }
      }
      return;
    }

    if (isPlaying) {
      userInitiatedPauseRef.current = true;
      if (autoResumeTimerRef.current) {
        clearTimeout(autoResumeTimerRef.current);
        autoResumeTimerRef.current = null;
      }
      playerRef.current.pauseVideo();
    } else {
      userInitiatedPauseRef.current = false;
      playerRef.current.playVideo();
    }
  }, [hasInteracted, isPlaying]);

  const seekTo = useCallback(
    (sec: number) => {
      if (!playerRef.current) return;
      const clamped = Math.max(0, Math.min(sec, duration || 300));
      playerRef.current.seekTo(clamped, true);
      setCurrentTime(clamped);
    },
    [duration]
  );

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolumeState(clamped);
    try {
      localStorage.setItem('chai_player_volume', String(clamped));
    } catch (e) {
      // ignore
    }

    if (playerRef.current) {
      try {
        if (clamped === 0) {
          playerRef.current.mute();
          setIsMuted(true);
        } else {
          if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
          }
          playerRef.current.setVolume(clamped);
        }
      } catch (e) {
        console.warn('Error setting volume:', e);
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      if (volume === 0) {
        const restored = 80;
        setVolumeState(restored);
        try {
          localStorage.setItem('chai_player_volume', String(restored));
        } catch (e) {}
        playerRef.current.setVolume(restored);
      }
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Media Session API: set title, artist ("Credits: channel"), artwork (thumbnail) and handlers for play, pause, previoustrack, nexttrack, seekto
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    try {
      const channelName = currentSong.author || 'T-Series';
      const artistText = `Credits: ${channelName}`;
      const artworkUrl = currentSong.id
        ? `https://i.ytimg.com/vi/${currentSong.id}/hqdefault.jpg`
        : '/pwa-512x512.png';

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title || '90s Bollywood Song',
        artist: artistText,
        album: 'Chai Tapri 90s Radio',
        artwork: [
          {
            src: artworkUrl,
            sizes: '480x360',
            type: 'image/jpeg',
          },
          {
            src: currentSong.id
              ? `https://i.ytimg.com/vi/${currentSong.id}/mqdefault.jpg`
              : '/pwa-192x192.png',
            sizes: '320x180',
            type: 'image/jpeg',
          },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        userInitiatedPauseRef.current = false;
        if (playerRef.current) {
          try {
            playerRef.current.playVideo();
          } catch (e) {
            togglePlay();
          }
        } else {
          togglePlay();
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        userInitiatedPauseRef.current = true;
        if (autoResumeTimerRef.current) {
          clearTimeout(autoResumeTimerRef.current);
          autoResumeTimerRef.current = null;
        }
        if (playerRef.current) {
          try {
            playerRef.current.pauseVideo();
          } catch (e) {
            togglePlay();
          }
        } else {
          togglePlay();
        }
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        userInitiatedPauseRef.current = false;
        prevTrackInternal();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        userInitiatedPauseRef.current = false;
        nextTrackInternal();
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seekTo(details.seekTime);
        }
      });

      if ('setPositionState' in navigator.mediaSession && duration > 0 && currentTime <= duration) {
        try {
          navigator.mediaSession.setPositionState({
            duration: duration,
            playbackRate: 1,
            position: Math.min(Math.max(0, currentTime), duration),
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [currentSong, isPlaying, duration, currentTime, nextTrackInternal, prevTrackInternal, seekTo, togglePlay]);

  // Keyboard Shortcuts: Space = play/pause, Left = Prev song, Right = Next song
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevTrackInternal();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextTrackInternal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, prevTrackInternal, nextTrackInternal]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentIndex,
        totalSongs: playlistIds.length,
        playlistIds,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        hasInteracted,
        activeQuote,
        blockedToast,
        togglePlay,
        nextTrack: nextTrackInternal,
        prevTrack: prevTrackInternal,
        seekTo,
        setVolume,
        toggleMute,
        playSongAtIndex,
        getSongMeta,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
