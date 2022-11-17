import { isNull } from "../utils/common";
import { parseTrackInfo } from "../utils/tracks";
import { sendNotification } from "./notifications";

export function initExternalAPI(mediaSession: MediaSession): void {
  function updateTrack(): void {
    const track = externalAPI.getCurrentTrack();

    if (!isNull(track)) {
      const parsedTrack = parseTrackInfo(track);

      mediaSession.metadata = new MediaMetadata(parsedTrack);

      sendNotification(parsedTrack.title ?? "No title", {
        icon: parsedTrack.icon,
        body: parsedTrack.artist,
        silent: true,
      });
    }
  }

  function updatePlayback(): void {
    mediaSession.playbackState = getPlaybackState();
  }

  function updatePositionState(): void {
    const progress = externalAPI.getProgress();

    mediaSession.setPositionState({
      duration: progress.duration,
      playbackRate: externalAPI.getSpeed(),
      position: progress.position,
    });
  }

  externalAPI.on(externalAPI.EVENT_TRACK, updateTrack);
  externalAPI.on(externalAPI.EVENT_STATE, updatePlayback);

  externalAPI.on(externalAPI.EVENT_SPEED, updatePositionState);
  externalAPI.on(externalAPI.EVENT_PROGRESS, updatePositionState);

  window.addEventListener("beforeunload", () => {
    externalAPI.togglePause(true);
  });
}

function getPlaybackState(): MediaSessionPlaybackState {
  const track = externalAPI.getCurrentTrack();

  if (isNull(track)) return "none";

  if (externalAPI.isPlaying()) return "playing";

  return "paused";
}
