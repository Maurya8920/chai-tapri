import { cleanSongTitle } from './cleanTitle';

export interface SongMetadata {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  thumbnail: string;
}

const CACHE_PREFIX = 'chai_tapri_song_';

/**
 * Fetch video metadata via noembed with localStorage caching.
 * Fails silently on error.
 */
export async function fetchSongMetadata(videoId: string): Promise<SongMetadata> {
  const defaultData: SongMetadata = {
    id: videoId,
    title: 'Purane Gaane',
    author: 'Hindi Retro',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };

  if (!videoId) return defaultData;

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${videoId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const rawTitle = data.title || 'Hindi Song';
    const author = data.author_name || 'Retro Bollywood';
    const { title, subtitle } = cleanSongTitle(rawTitle);

    const result: SongMetadata = {
      id: videoId,
      title,
      subtitle,
      author,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };

    // Save to cache
    try {
      localStorage.setItem(`${CACHE_PREFIX}${videoId}`, JSON.stringify(result));
    } catch {
      // Storage might be full, ignore
    }

    return result;
  } catch {
    // Fail silently and return fallback metadata
    return defaultData;
  }
}
