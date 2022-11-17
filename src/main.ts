import { initExternalAPI } from "./lib/init/externalAPI";
import { initMediaSessionActions } from "./lib/init/mediaSession";
import { initNotifications } from "./lib/init/notifications";

initNotifications();
initExternalAPI(navigator.mediaSession);
initMediaSessionActions(navigator.mediaSession);

console.log("YaMusic extension loaded!");
