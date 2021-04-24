function initMediaSessionActions(mediaSession: MediaSession) {
    mediaSession.setActionHandler("play", () => externalAPI.togglePause(false));
    mediaSession.setActionHandler("pause", () => externalAPI.togglePause(true));
    mediaSession.setActionHandler("previoustrack", () => externalAPI.prev());
    mediaSession.setActionHandler("nexttrack", () => externalAPI.next());

    const seekTime = 10;

    mediaSession.setActionHandler("seekbackward", () => {
        const { position } = externalAPI.getProgress();

        externalAPI.setPosition(Math.max(position - seekTime, 0));
    });

    mediaSession.setActionHandler("seekforward", () => {
        const { duration, position } = externalAPI.getProgress();

        externalAPI.setPosition(Math.min(position + seekTime, duration));
    });

    mediaSession.setActionHandler("seekto", ({ seekTime }) => {
        externalAPI.setPosition(seekTime);
    });
}
