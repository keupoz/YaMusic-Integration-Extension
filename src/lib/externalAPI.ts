import { sendNotification } from "./notifications";
import { getTrackInfo } from "./tracks";
import { isNull } from "./utils";

export function initExternalAPI(mediaSession: MediaSession) {
    function updateTrack() {
        const track = externalAPI.getCurrentTrack();

        if (isNull(track)) {
            mediaSession.metadata = null;

            return;
        }

        const { album, artist, artwork, icon, title } = getTrackInfo(track);

        mediaSession.metadata = new MediaMetadata({ album, artist, artwork, title });

        sendNotification(title, {
            icon,
            body: artist,
            silent: true
        });
    }

    function updatePlayback() {
        mediaSession.playbackState = getPlaybackState();
    }

    externalAPI.on(externalAPI.EVENT_TRACK, updateTrack);
    externalAPI.on(externalAPI.EVENT_STATE, updatePlayback);

    if (mediaSession.setPositionState !== undefined) {
        const setPositionState = mediaSession.setPositionState.bind(mediaSession);

        initPositionState(setPositionState);
    }
}

function initPositionState(setPositionState: SetPositionState) {
    function updatePositionState() {
        const progress = externalAPI.getProgress();

        setPositionState({
            duration: progress.duration,
            playbackRate: externalAPI.getSpeed(),
            position: progress.position
        });
    }

    externalAPI.on(externalAPI.EVENT_SPEED, updatePositionState);
    externalAPI.on(externalAPI.EVENT_PROGRESS, updatePositionState);
}

function getPlaybackState(): MediaSessionPlaybackState {
    const track = externalAPI.getCurrentTrack();

    if (isNull(track)) return "none";

    if (externalAPI.isPlaying()) return "playing";

    return "paused";
}
