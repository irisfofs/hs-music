
// TODO: Look if this exists in d3 code.
export interface D3Item {
  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;
}

export class Track implements D3Item {
  page: number;
  pageTitle: string;
  pageLink: string;
  title: string;
  trackLink?: string;
  trackId?: number;
  album: string;
  albumLink: string;
  albumId?: number;
  artist?: string;
  artistLink?: string;
  longArtist: string[];

  coverLink?: string;

  heightLevel: number = 0;

  // rect?: Rect;
  // coverSize?: Size;

  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;

  constructor(trackJson: {
    page: number,
    page_title: string,
    page_link: string,
    album: string,
    album_link: string,
    album_id: number,
    artist?: string,
    artist_link?: string,
    title?: string,
    track_link?: string,
    track_id?: number,
    long_artist?: string[],
  }) {
    this.page = trackJson.page;
    this.title = trackJson.title;
    this.trackLink = trackJson.track_link;
    this.pageLink = trackJson.page_link;
    this.album = trackJson.album;
    this.albumLink = trackJson.album_link;
    this.albumId = trackJson.album_id;
    this.artist = trackJson.artist;
    this.artistLink = trackJson.artist_link;
    this.pageTitle = trackJson.page_title;
    this.trackId = trackJson.track_id;
    this.longArtist = trackJson.long_artist || [];

    setCoverFilename(this);
  }

  getAbsolutePageLink() {
    return `https://www.homestuck.com${this.pageLink}`;
  }
}

function setCoverFilename(track: Track) {
  if (track.title && track.trackLink) {
    const fn =
        track.title.toLowerCase().replace(/ /g, '_').replace(/[^\w-]/g, '');
    track.coverLink = `assets/covers/cover_${fn}.jpg`;
  } else {
    track.coverLink = undefined;
  }
}
