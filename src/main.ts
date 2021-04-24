import { initExternalAPI } from "./lib/externalAPI";
import { initNotifications } from "./lib/notifications";

if (navigator.mediaSession === undefined) {
    throw new Error("MediaSession API is not supported by your browser");
}

initNotifications();
initExternalAPI(navigator.mediaSession);
initMediaSessionActions(navigator.mediaSession);

console.log("YaMusic extension loaded!");
