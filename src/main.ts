import { initNotifications, sendNotification } from "./lib/notifications";
import { getAlbum, getArtist, getArtwork, getIcon, getTitle } from "./lib/tracks";
import { isNull } from "./lib/utils";
import { TrackInfo } from "./lib/YaMusic.externalAPI";

if (navigator.mediaSession === undefined) {
    throw new Error("MediaSession API is not supported by your browser");
}

// Ensure that mediaSession is defined inside functions
const { mediaSession } = navigator;

function updateTrack(track?: TrackInfo | null): void {
    if (isNull(track)) {
        mediaSession.metadata = null;

        return;
    }

    const album = getAlbum(track),
        artist = getArtist(track),
        artwork = getArtwork(track),
        icon = getIcon(artwork),
        title = getTitle(track);

    mediaSession.metadata = new MediaMetadata({ album, artist, artwork, title });

    sendNotification(title, {
        icon,
        body: artist,
        silent: true
    });
}

initNotifications();

externalAPI.on(externalAPI.EVENT_TRACK, () => updateTrack(externalAPI.getCurrentTrack()));

mediaSession.setActionHandler("play", () => externalAPI.togglePause(false));
mediaSession.setActionHandler("pause", () => externalAPI.togglePause(true));
mediaSession.setActionHandler("previoustrack", () => externalAPI.prev());
mediaSession.setActionHandler("nexttrack", () => externalAPI.next());

console.log("YaMusic extension loaded!");
