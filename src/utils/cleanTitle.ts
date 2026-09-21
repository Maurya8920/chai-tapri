/**
 * Clean YouTube song titles by removing marketing noise, bracketed tags,
 * resolution tags, and full video/lyrical text.
 */
export function cleanSongTitle(rawTitle: string): { title: string; subtitle?: string } {
  if (!rawTitle || rawTitle.trim() === '') {
    return { title: '90s Hit Song' };
  }

  let cleaned = rawTitle;

  // 1. Remove bracketed / parenthetical marketing tags
  cleaned = cleaned.replace(
    /\s*[\[\(](?:Official|Full Video|Video Song|Lyrical Video|Lyrical|Audio Song|Audio|4K|HD|Remastered|HQ|720p|1080p|With Lyrics|Full Song|Song|Lyrics|Original|Dolby|Stereo|Film Version|Slowed\s*\+\s*Reverb|Slowed|Reverb|Textaudio|From "[^"]+")[^\]\)]*[\]\)]/gi,
    ' '
  );

  // 2. Remove trailing channel / company pipes "| ...", " - T-Series", etc.
  cleaned = cleaned.replace(/\s*\|.*$/i, '');

  // 3. Remove standalone keywords like "Full Song", "Video Song", etc.
  cleaned = cleaned.replace(
    /\b(?:Full Song|Video Song|Lyrical Video|Official Video|Audio Song|HD Song|Slowed\s*\+\s*Reverb)\b/gi,
    ''
  );

  // 4. Split on hyphen if movie/artist is separated, e.g. "Song Name - Movie"
  const parts = cleaned.split(/\s*-\s*/);
  let mainTitle = cleaned.trim();
  let subtitle: string | undefined = undefined;

  if (parts.length >= 2) {
    mainTitle = parts[0].trim();
    subtitle = parts.slice(1).join(' - ').trim();
  }

  // 5. Clean extra whitespace and punctuation
  mainTitle = mainTitle.replace(/\s{2,}/g, ' ').replace(/^["'-\s]+|["'-\s]+$/g, '');
  if (subtitle) {
    subtitle = subtitle.replace(/\s{2,}/g, ' ').replace(/^["'-\s]+|["'-\s]+$/g, '');
  }

  return {
    title: mainTitle || rawTitle || '90s Hit Song',
    subtitle: subtitle || undefined,
  };
}

/**
 * Format duration in seconds to M:SS or H:MM:SS
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const padSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${padSecs}`;
  }
  return `${mins}:${padSecs}`;
}
