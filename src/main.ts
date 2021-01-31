import { TrackInfo } from "./lib/YaMusic.externalAPI";

if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

const AVAILABLE_COVERS = [30, 50, 80, 100, 200, 300, 400].map((size) => `${size}x${size}`);

function generateArtwork(url: string): MediaImage[] {
    return AVAILABLE_COVERS.map((size) => ({
        src: url.replace("%%", size),
        sizes: size
    }));
}

function updateTrack(track?: TrackInfo): void {
    if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

    navigator.mediaSession.metadata = track ? new MediaMetadata({
        title: track.title + (track.version ? `(${track.version})` : ""),
        artist: track.artists.map((artist) => artist.title).join(", "),
        album: track.album?.title,
        artwork: track.cover ? generateArtwork(`https://${track.cover}`) : undefined
    }) : null;
}

externalAPI.on(externalAPI.EVENT_TRACK, () => updateTrack(externalAPI.getCurrentTrack()));

navigator.mediaSession.setActionHandler("play", () => externalAPI.togglePause(false));
navigator.mediaSession.setActionHandler("pause", () => externalAPI.togglePause(true));
navigator.mediaSession.setActionHandler("previoustrack", () => externalAPI.prev());
navigator.mediaSession.setActionHandler("nexttrack", () => externalAPI.next());

console.log("YaMusic extension loaded!");
