import { TrackInfo } from "./lib/YaMusic.externalAPI";

if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

const AVAILABLE_COVERS = [30, 50, 80, 100, 200, 300, 400].map((size) => `${size}x${size}`);

function generateArtwork(url: string): MediaImage[] {
    return AVAILABLE_COVERS.map((size) => ({
        sizes: size,
        src: url.replace("%%", size)
    }));
}

let lastNotification: Notification | null = null;

function updateTrack(track?: TrackInfo): void {
    if (navigator.mediaSession === undefined) throw new Error("MediaSession API isn't supported by your browser");

    if (track === undefined) {
        navigator.mediaSession.metadata = null;

        return;
    }

    const title = track.title + (track.version !== undefined ? ` (${track.version})` : ""),
        artist = track.artists.map((artist) => artist.title).join(", "),
        cover = track.cover !== undefined ? generateArtwork(`https://${track.cover}`) : undefined;

    navigator.mediaSession.metadata = new MediaMetadata({
        title,
        album: track.album?.title,
        artist: artist === "" ? track.album?.title : artist,
        artwork: cover
    });

    if (Notification.permission === "granted") {
        if (lastNotification !== null) lastNotification.close();

        lastNotification = new Notification(title, {
            body: artist === "" ? track.album?.title : artist,
            icon: cover !== undefined ? cover[4].src : undefined,
            silent: true
        });

        lastNotification.onclick = () => {
            window.focus();
        };
    }
}

if (Notification.permission === "default") Notification.requestPermission();

window.addEventListener("beforeunload", () => {
    if (lastNotification !== null) lastNotification.close();
});

externalAPI.on(externalAPI.EVENT_TRACK, () => updateTrack(externalAPI.getCurrentTrack()));

navigator.mediaSession.setActionHandler("play", () => externalAPI.togglePause(false));
navigator.mediaSession.setActionHandler("pause", () => externalAPI.togglePause(true));
navigator.mediaSession.setActionHandler("previoustrack", () => externalAPI.prev());
navigator.mediaSession.setActionHandler("nexttrack", () => externalAPI.next());

console.log("YaMusic extension loaded!");
