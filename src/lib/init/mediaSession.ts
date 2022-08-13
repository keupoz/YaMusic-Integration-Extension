import { isNull } from '../utils/common'

export function initMediaSessionActions (mediaSession: MediaSession): void {
  mediaSession.setActionHandler('play', () => externalAPI.togglePause(false))
  mediaSession.setActionHandler('pause', () => externalAPI.togglePause(true))
  mediaSession.setActionHandler('previoustrack', () => { void externalAPI.prev() })
  mediaSession.setActionHandler('nexttrack', () => { void externalAPI.next() })

  const seekTime = 5

  mediaSession.setActionHandler('seekbackward', () => {
    const { position } = externalAPI.getProgress()

    externalAPI.setPosition(Math.max(position - seekTime, 0))
  })

  mediaSession.setActionHandler('seekforward', () => {
    const { duration, position } = externalAPI.getProgress()

    externalAPI.setPosition(Math.min(position + seekTime, duration))
  })

  mediaSession.setActionHandler('seekto', ({ seekTime }) => {
    if (isNull(seekTime)) return

    externalAPI.setPosition(seekTime)
  })
}
