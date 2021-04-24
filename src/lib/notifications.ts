let notification: Notification | null = null;

export function sendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission !== "granted") return;

    if (notification !== null) notification.close();

    notification = new Notification(title, options);
    notification.addEventListener("click", () => {
        window.focus();
    });
}

export function initNotifications() {
    if (Notification.permission === "default") Notification.requestPermission();

    window.addEventListener("beforeunload", () => {
        if (notification !== null) notification.close();
    });
}
