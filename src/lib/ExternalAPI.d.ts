/**
 * Cover URL without protocol
 *
 * ```javascript
 * const Cover = "avatars.yandex.net/get-music-content/2399641/1d2a9b69.p.42004/%%";
 * ```
 */
export type CoverInfo = string | string[];

/**
 * Yandex.Music artist object
 *
 * ```javascript
 * const Artist = {
 *   title: "Hollywood Undead",
 *   cover: "avatars.yandex.net/get-music-content/2399641/1d2a9b69.p.42004/%%",
 *   link: "/artist/42004"
 * };
 * ```
 */
export interface ArtistInfo {
  /** Artist's name */
  title: string;

  /** Link to the artist */
  link: string;

  /** Artist's avatar */
  cover?: CoverInfo;
}

/**
 * Yandex.Music album object
 *
 * ```javascript
 * const Album = {
 *   title: "Empire",
 *   year: 2020,
 *   cover: "/album/9582015/track/61434766",
 *   link: "/album/9582015",
 *   artists: [Artist]
 * };
 * ```
 */
export interface AlbumInfo {
  /** Album title */
  title: string;

  /** Album release year */
  year: number;

  /** Link to the album */
  link: string;

  /** Artists list */
  artists: ArtistInfo[];

  /** Album cover */
  cover?: CoverInfo;
}

/**
 * Yandex.Music track object
 *
 * ```javascript
 * const Track = {
 *   title: "Empire",
 *   version: undefined,
 *   cover: "avatars.yandex.net/get-music-content/2390047/589e7ea5.a.9582015-1/%%",
 *   duration: 239.31,
 *   liked: false,
 *   disliked: false,
 *   link: "/album/9582015/track/61434766",
 *   album: Album,
 *   artists: [Artist]
 * };
 * ```
 */
export interface TrackInfo {
  /** Track title */
  title: string;

  /** Link to the track */
  link: string;

  /** Track duration in seconds */
  duration: number;

  /** Is the track liked */
  liked: boolean;

  /** Is the track disliked */
  disliked: boolean;

  /** Artists list */
  artists: ArtistInfo[];

  /** Track version */
  version?: string;

  /** Track album */
  album?: AlbumInfo;

  /** Track cover */
  cover?: CoverInfo;
}

/**
 * Yandex.Music playlist object
 *
 * ```javascript
 * const Playlist = {
 *   title: "Playlist of the day",
 *   owner: "yamusic-daily"
 *   cover: "avatars.yandex.net/get-music-user-playlist/38125/q0ahkhfQE3neTk/%%?1572609906461",
 *   link: "/users/yamusic-daily/113122042",
 *   type: "playlist"
 * };
 * ```
 */
export interface PlaylistInfo {
  /** Playlist title */
  title: string;

  /** Playlist owner name */
  owner: string;

  /** Link to the playlist page without domain */
  link: string;

  /** Cover URL without protocol */
  cover?: CoverInfo;
}

/**
 * Yandex.Music radio object
 */
export interface RadioInfo {
  /** Radio title */
  title: string;

  /** Link to the radio */
  link: string;

  /** Radio cover */
  cover?: CoverInfo;
}

/**
 * Yandex.Music common source object
 */
export interface CommonSourceInfo {
  /** Source title */
  title: string;

  /** Link to the source */
  link: string;
}

/**
 * Yandex.Music source object
 */
type SourceType = "album" | "artist" | "playlist" | "radio" | "common";
type SourceWrap<S, T extends SourceType> = S & { type: T };
type SourceInfo =
  | SourceWrap<AlbumInfo, "album">
  | SourceWrap<ArtistInfo, "artist">
  | SourceWrap<PlaylistInfo, "playlist">
  | SourceWrap<RadioInfo, "radio">
  | SourceWrap<CommonSourceInfo, "common">;

export interface PlaybackInfo {
  /** Current track duration */
  duration: number;

  /** Duration of loaded part */
  loaded: number;

  /** Current playing position */
  position: number;
}

export enum Events {
  /** Current interface is ready */
  EVENT_READY = "ready",

  /** Player state changed */
  EVENT_STATE = "state",

  /** Track changed */
  EVENT_TRACK = "track",

  /** Ad is playing */
  EVENT_ADVERT = "advert",

  /** Shot is playing */
  EVENT_SHOT = "shot",

  /** Player controls changed (includes shuffle and repeat state) */
  EVENT_CONTROLS = "controls",

  /** Playing source changed */
  EVENT_SOURCE_INFO = "info",

  /** Track list changed */
  EVENT_TRACKS_LIST = "tracks",

  /** Volume changed */
  EVENT_VOLUME = "volume",

  /** Speed changed */
  EVENT_SPEED = "speed",

  /** Time metrics of current track changed */
  EVENT_PROGRESS = "progress",
}

export enum ShuffleState {
  SHUFFLE_ON = true,
  SHUFFLE_OFF = false,
}

export enum RepeatState {
  REPEAT_ONE = 1,
  REPEAT_ALL = true,
  REPEAT_NONE = false,
}

export enum ControlState {
  /** Control enabled */
  CONTROL_ENABLED = true,

  /** Control disabled */
  CONTROL_DISABLED = false,

  /** Control is not available */
  CONTROL_DENIED = null,
}

export interface Controls {
  /** Possibility to play the track by its index */
  index: ControlState;

  /** Possibility to switch to the next track */
  next: ControlState;

  /** Possibility to switch to the previous track */
  prev: ControlState;

  /** Possibility to enable shuffle */
  shuffle: ControlState;

  /** Possibility to enable repeat */
  repeat: ControlState;

  /** Possibility to add the track to liked */
  like: ControlState;

  /** Possibility to blacklist the track */
  dislike: ControlState;
}

export interface ExternalAPI {
  /** Print help message in console */
  help: () => void;

  /** Add event listener */
  on: (eventType: Events, fn: (...data: any[]) => void) => void;

  /** Remove event listener */
  off: (eventType: Events, fn: (...data: any[]) => void) => void;

  /** Trigger event. Just calls listener for specified event */
  trigger: (eventType: Events, ...data: any[]) => void;

  getCurrentTrack: () => TrackInfo | null;
  getNextTrack: () => TrackInfo | null;
  getPrevTrack: () => TrackInfo | null;

  /** Get current tracks list */
  getTracksList: () => TrackInfo[];

  /** Get current track index in tracks list */
  getTrackIndex: () => number;

  /** Get current source info */
  getSourceInfo: () => SourceInfo;

  /**
   * Load tracks data into current tracks list
   *
   * @param ordered Load tracks in order of playing instead of order by list index
   * @returns Promise with value representing success of the operation
   */
  populate: (
    fromIndex: number,
    after?: number,
    before?: number,
    ordered?: boolean
  ) => Promise<boolean>;

  /** Is player ready and not paused */
  isPlaying: () => boolean;

  /** Get player controls info */
  getControls: () => Controls;

  /** Get shuffle state (`SHUFFLE_ON`/`SHUFFLE_OFF`) */
  getShuffle: () => ShuffleState;

  /** Get repeat state (`REPEAT_ONE`/`REPEAT_ALL`/`REPEAT_NONE`) */
  getRepeat: () => RepeatState;

  /** Get playback volume */
  getVolume: () => number;

  /** Get playback speed */
  getSpeed: () => number;

  /** Get progress info */
  getProgress: () => PlaybackInfo;

  /**
   * Play selected track.
   *
   * Restarts the track if already playing. To toggle playback see `togglePause()`
   *
   * @param index Select a track to play by index of current tracks list
   * @returns Promise with value representing success of the operation
   */
  play: (index?: number) => Promise<boolean>;

  /**
   * Play next track
   *
   * @returns Promise with value representing success of the operation
   */
  next: () => Promise<boolean>;

  /**
   * Play previous track
   *
   * @returns Promise with value representing success of the operation
   */
  prev: () => Promise<boolean>;

  /**
   * Toggle pause
   *
   * @param state Specify pause state
   */
  togglePause: (state?: boolean) => void;

  /**
   * Add current track to favorites/remove it from favorites
   *
   * @returns Promise with value representing success of the operation
   */
  toggleLike: () => Promise<boolean>;

  /**
   * Add current track to blacklist/remove it from blacklist
   *
   * @returns Promise with value representing success of the operation
   */
  toggleDislike: () => Promise<boolean>;

  /**
   * Toggle shuffle
   *
   * @param state Specify shuffle state (`SHUFFLE_ON`/`SHUFFLE_OFF`)
   * @returns New shuffle state
   */
  toggleShuffle: (state?: ShuffleState) => ShuffleState;

  /**
   * Toggle repeat
   *
   * @param state Specify repeat state (`REPEAT_ONE`/`REPEAT_ALL`/`REPEAT_NONE`)
   * @returns New repeat state
   */
  toggleRepeat: (state?: RepeatState) => RepeatState;

  /** Set playback volume */
  setVolume: (value: number) => void;

  /** Set playback speed */
  setSpeed: (value: number) => void;

  /** Toggle mute */
  toggleMute: (state?: boolean) => void;

  /**
   * Set playback position
   *
   * @param value Position in seconds
   * @returns The position that was actually set
   */
  setPosition: (value: number) => number;

  /**
   * Navigate to specified URL. URL can be obtained from playlist, artist, album or track objects
   *
   * @param url URL to navigate to without protocol and domain
   * @returns Success of the operation. If page doesn't exist, still returns `true`
   */
  navigate: (url: string) => boolean;
}

declare global {
  const externalAPI: ExternalAPI &
    typeof Events &
    typeof ShuffleState &
    typeof RepeatState &
    typeof ControlState;
}
