let lastNotification: Notification | null = null

export function sendNotification (title: string, options?: NotificationOptions): void {
  if (Notification.permission !== 'granted') return

  if (lastNotification !== null) {
    lastNotification.close()
  }

  lastNotification = new Notification(title, options)
  lastNotification.addEventListener('click', window.focus)
}

export function initNotifications (): void {
  if (Notification.permission === 'default') {
    void Notification.requestPermission()
  }

  window.addEventListener('beforeunload', () => {
    if (lastNotification !== null) {
      lastNotification.close()
    }
  })
}
