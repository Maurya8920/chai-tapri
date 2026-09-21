// Type declarations for YouTube IFrame Player API

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            disablekb?: 0 | 1;
            fs?: 0 | 1;
            playsinline?: 0 | 1;
            rel?: 0 | 1;
            listType?: 'playlist' | 'search' | 'user_uploads';
            list?: string;
            index?: number;
            origin?: string;
            enablejsapi?: 0 | 1;
          };
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTOnStateChangeEvent) => void;
            onError?: (event: YTOnErrorEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerEvent {
  target: YTPlayer;
}

export interface YTOnStateChangeEvent {
  target: YTPlayer;
  data: number;
}

export interface YTOnErrorEvent {
  target: YTPlayer;
  data: number;
}

export interface YTVideoData {
  video_id: string;
  author: string;
  title: string;
  video_quality?: string;
}

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (videoId: string | { videoId: string; startSeconds?: number; endSeconds?: number }, startSeconds?: number) => void;
  cueVideoById: (videoId: string | { videoId: string; startSeconds?: number; endSeconds?: number }, startSeconds?: number) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  playVideoAt: (index: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getDuration: () => number;
  getCurrentTime: () => number;
  getVideoLoadedFraction: () => number;
  getPlayerState: () => number;
  getVideoData: () => YTVideoData;
  getPlaylist: () => string[] | null;
  getPlaylistIndex: () => number;
  loadPlaylist: (
    playlist:
      | string
      | string[]
      | {
          listType?: 'playlist';
          list: string;
          index?: number;
          startSeconds?: number;
        }
  ) => void;
  cuePlaylist: (
    playlist:
      | string
      | string[]
      | {
          listType?: 'playlist';
          list: string;
          index?: number;
          startSeconds?: number;
        }
  ) => void;
  setShuffle: (shufflePlaylist: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
  destroy: () => void;
}
