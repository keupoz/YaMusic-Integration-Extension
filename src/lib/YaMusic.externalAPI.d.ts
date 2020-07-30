/**
 * Yandex.Music artist object
 *
 * ```javascript
 * const YaArtistExample = {
 *   title: "Hollywood Undead",
 *   cover: "avatars.yandex.net/get-music-content/2399641/1d2a9b69.p.42004/%%",
 *   link: "/artist/42004"
 * };
 * ```
**/
export type YaArtist = {
    /** Artist name */
    title: string,

    /** Cover URL without protocol */
    cover: string,

    /** Link to the artist page without domain */
    link: string
};

/**
 * Yandex.Music album object
 *
 * ```javascript
 * const YaAlbumExample = {
 *   title: "Empire",
 *   year: 2020,
 *   cover: "/album/9582015/track/61434766",
 *   link: "/album/9582015",
 *   artists: [YaArtistExample]
 * };
 * ```
**/
export type YaAlbum = {
    /** Album title */
    title: string,

    /** Release date */
    year: number,

    /** Cover URL without protocol */
    cover: string,

    /** Link to the album page without domain */
    link: string,

    /** List of artists */
    artists: YaArtist[]
};

/**
 * Yandex.Music track object
 *
 * ```javascript
 * const YaTrackExample = {
 *   title: "Empire",
 *   version: undefined,
 *   cover: "avatars.yandex.net/get-music-content/2390047/589e7ea5.a.9582015-1/%%",
 *   duration: 239.31,
 *   liked: false,
 *   disliked: false,
 *   link: "/album/9582015/track/61434766",
 *   album: YaAlbumExample,
 *   artists: [YaArtistExample]
 * };
 * ```
**/
export type YaTrack = {
    /** Track title */
    title: string,

    /** Track version */
    version: number,

    /** Cover URL without protocol */
    cover: string,

    /** Track duration in seconds */
    duration: number,

    /** Is track liked by user */
    liked: boolean,

    /** Is track disliked by user */
    disliked: boolean,

    /** Link to the track page without domain */
    link: string,

    /** Track album */
    album: YaAlbum,

    /** List of artists */
    artists: YaArtist[]
};

/**
 * Yandex.Music playlist object
 *
 * ```javascript
 * const YaPlaylist = {
 *   title: "Playlist of the day",
 *   owner: "yamusic-daily"
 *   cover: "avatars.yandex.net/get-music-user-playlist/38125/q0ahkhfQE3neTk/%%?1572609906461",
 *   link: "/users/yamusic-daily/113122042",
 *   type: "playlist"
 * };
 * ```
**/
export type YaPlaylist = {
    /** Playlist title */
    title: string,

    /** Playlist owner name */
    owner: string,

    /** Link to the playlist page without domain */
    link: string,

    /** Cover URL without protocol */
    cover: string,

    /** Playing source type */
    type: "playlist"
};

export type YaProgress = {
    /** Current playing position */
    position: number,

    /** Current track duration */
    duration: number,

    /** Duration of loaded part */
    loaded: number
};

export enum YaEvents {
    /** Current interface is ready */
    EVENT_READY = "ready",

    /** Player state changed */
    EVENT_STATE = "state",

    /** Track changed */
    EVENT_TRACK = "track",

    /** Ad is playing */
    EVENT_ADVERT = "advert",

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
    EVENT_PROGRESS = "progress"
}

export type YaControlState = boolean | null;
export type YaShuffleState = boolean;
export type YaRepeatState = boolean | 1;

export type YaControls = {
    index: YaControlState,
    next: YaControlState,
    prev: YaControlState,
    shuffle: YaControlState,
    repeat: YaControlState,
    like: YaControlState,
    dislike: YaControlState
};

declare global {
    const externalAPI: typeof YaEvents & {
        SHUFFLE_ON: true,
        SHUFFLE_OFF: false,

        REPEAT_ONE: 1,
        REPEAT_ALL: true,
        REPEAT_NONE: false,

        CONTROL_ENABLED: true,
        CONTROL_DISABLED: false,
        CONTROL_DENIED: null,

        /** Print help message in console */
        help: () => void,

        /** Add event listener */
        on: (eventType: YaEvents, fn: (...data: any[]) => void) => void,

        /** Remove event listener */
        off: (eventType: YaEvents, fn: (...data: any[]) => void) => void,

        /** Trigger event. Just calls listener for specified event */
        trigger: (eventType: YaEvents, ...data: any[]) => void,

        getCurrentTrack: () => YaTrack,
        getNextTrack: () => YaTrack,
        getPrevTrack: () => YaTrack,

        /** Get current tracks list */
        getTracksList: () => YaTrack[],

        /** Get current track index in tracks list */
        getTrackIndex: () => number,

        /** Get current playlist info */
        getSourceInfo: () => YaPlaylist,

        /**
         * Load tracks data into current tracks list
         *
         * @param ordered Load tracks in order of playing instead of order by list index
         * @returns Promise with value representing success of the operation
         */
        populate: (fromIndex: number, after?: number, before?: number, ordered?: boolean) => Promise<boolean>,

        /** Is player ready and not paused */
        isPlaying: () => boolean,

        /** Get player controls info */
        getControls: () => YaControls,

        /** Get shuffle state (`SHUFFLE_ON`/`SHUFFLE_OFF`) */
        getShuffle: () => YaShuffleState,

        /** Get repeat state (`REPEAT_ONE`/`REPEAT_ALL`/`REPEAT_NONE`) */
        getRepeat: () => YaRepeatState,

        /** Get playback volume */
        getVolume: () => number,

        /** Get playback speed */
        getSpeed: () => number,

        /** Get progress info */
        getProgress: () => YaProgress,

        /**
         * Play selected track.
         *
         * Restarts the track if already playing. To toggle playback see `togglePause()`
         *
         * @param index Select a track to play by index of current tracks list
         * @returns Promise with value representing success of the operation
         */
        play: (index?: number) => Promise<boolean>,

        /**
         * Play next track
         *
         * @returns Promise with value representing success of the operation
         */
        next: () => Promise<boolean>,

        /**
         * Play previous track
         *
         * @returns Promise with value representing success of the operation
         */
        prev: () => Promise<boolean>,

        /**
         * Toggle pause
         *
         * @param state Specify pause state
         */
        togglePause: (state?: boolean) => void,

        /**
         * Add current track to favorites/remove it from favorites
         *
         * @returns Promise with value representing success of the operation
         */
        toggleLike: () => Promise<boolean>,

        /**
         * Add current track to blacklist/remove it from blacklist
         *
         * @returns Promise with value representing success of the operation
         */
        toggleDislike: () => Promise<boolean>,

        /**
         * Toggle shuffle
         *
         * @param state Specify shuffle state (`SHUFFLE_ON`/`SHUFFLE_OFF`)
         * @returns New shuffle state
         */
        toggleShuffle: (state?: YaShuffleState) => YaShuffleState,

        /**
         * Toggle repeat
         *
         * @param state Specify repeat state (`REPEAT_ONE`/`REPEAT_ALL`/`REPEAT_NONE`)
         * @returns New repeat state
         */
        toggleRepeat: (state?: YaRepeatState) => YaRepeatState,

        /** Set playback volume */
        setVolume: (value: number) => void,

        /** Set playback speed */
        setSpeed: (value: number) => void,

        /** Toggle mute */
        toggleMute: (state?: boolean) => void,

        /**
         * Set playback position
         *
         * @param value Position in seconds
         * @returns The position that was actually set
         */
        setPosition: (value: number) => number,

        /**
         * Navigate to specified URL. URL can be obtained from playlist, artist, album or track objects
         *
         * @param url URL to navigate to without protocol and domain
         * @returns Success of the operation. If page doesn't exist, still returns `true`
         */
        navigate: (url: string) => boolean
    }
}
