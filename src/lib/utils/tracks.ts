import { TrackInfo } from '../ExternalAPI'
import { isNull } from './common'

export interface ParsedTrackInfo extends MediaMetadataInit {
  icon: NotificationOptions['icon']
}

const AVAILABLE_COVERS = ['30x30', '50x50', '80x80', '100x100', '200x200', '300x300', '400x400']

export function parseTrackInfo (track: TrackInfo): ParsedTrackInfo {
  const album = parseAlbum(track)
  const artist = parseArtist(track)
  const artwork = parseArtwork(track)
  const icon = parseIcon(artwork)
  const title = parseTitle(track)

  return { album, artist, artwork, title, icon }
}

function parseAlbum (track: TrackInfo): string | undefined {
  if (isNull(track.album)) return

  return track.album.title
}

function parseArtist (track: TrackInfo): string | undefined {
  if (track.artists.length === 0) {
    if (isNull(track.album)) return

    // Podcasts may have the author in album title instead
    return track.album.title
  }

  return track.artists.map((artist) => artist.title).join(', ')
}

function parseArtwork (track: TrackInfo): MediaImage[] | undefined {
  const cover = Array.isArray(track.cover) ? track.cover[0] : track.cover

  if (isNull(cover)) return

  const url = `https://${cover}`

  return AVAILABLE_COVERS.map((size) => ({
    sizes: size,
    src: url.replace('%%', size)
  }))
}

function parseIcon (artwork?: MediaImage[]): string | undefined {
  if (artwork === undefined || artwork[4] === undefined) return

  return artwork[4].src
}

function parseTitle (track: TrackInfo): string {
  let result = track.title

  if (track.version !== undefined) {
    result += ` (${track.version})`
  }

  return result
}
