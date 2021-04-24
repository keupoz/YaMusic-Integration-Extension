import { isNull } from "./utils";
import { TrackInfo } from "./YaMusic.externalAPI";

const AVAILABLE_COVERS = [30, 50, 80, 100, 200, 300, 400].map((size) => `${size}x${size}`);

export function getAlbum(track: TrackInfo) {
    if (isNull(track.album)) return undefined;

    return track.album.title;
}

export function getArtist(track: TrackInfo) {
    if (track.artists.length === 0) {
        if (isNull(track.album)) return undefined;

        // Podcasts may have the author in album title instead
        return track.album.title;
    }

    let result = "";

    for (const artist of track.artists) {
        result += `, ${artist.title}`;
    }

    return result;
}

export function getArtwork(track: TrackInfo): MediaImage[] | undefined {
    if (track.cover === undefined) return;

    const cover = `https://${track.cover}`;

    return AVAILABLE_COVERS.map((size) => ({
        sizes: size,
        src: cover.replace("%%", size)
    }));
}

export function getIcon(artwork?: MediaImage[]) {
    if (artwork === undefined) return undefined;

    return artwork[4].src;
}

export function getTitle(track: TrackInfo) {
    let result = track.title;

    if (track.version !== undefined) result += ` (${track.version})`;

    return result;
}
