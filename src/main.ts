import { YaTrack } from "./YaMusic.externalAPI";

if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

const AVAILABLE_COVERS = [30, 50, 80, 100, 200, 300, 400].map((size) => `${size}x${size}`);

function generateCoverAssets(url: string, type = ""): MediaImage[] {
    return AVAILABLE_COVERS.map((size) => ({
        src: `https://${url.replace("%%", size)}`,
        sizes: size,
        type
    }));
}

function setMetadata(track: YaTrack): void {
    if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

    navigator.mediaSession.metadata = track ? new MediaMetadata({
        title: track.title,
        artist: track.artists.map((artist) => artist.title).join(", "),
        album: track.album.title,
        artwork: generateCoverAssets(track.cover)
    }) : null;
}

externalAPI.on(externalAPI.EVENT_TRACK, () => setMetadata(externalAPI.getCurrentTrack()));

navigator.mediaSession.setActionHandler("play", () => externalAPI.togglePause(false));
navigator.mediaSession.setActionHandler("pause", () => externalAPI.togglePause(true));
navigator.mediaSession.setActionHandler("previoustrack", () => externalAPI.prev());
navigator.mediaSession.setActionHandler("nexttrack", () => externalAPI.next());

console.log("YaMusic extension loaded!");
