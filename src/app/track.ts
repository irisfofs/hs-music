
// TODO: Look if this exists in d3 code.
export interface D3Item {
  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;
}

export class Track implements D3Item {
  page: number;
  title: string;
  trackLink?: string;
  pageTitle: string;
  pageLink: string;
  album: string;
  albumLink: string;
  artist?: string;
  artistLink?: string;
  longArtist: string[];

  coverLink: string;

  heightLevel: number = 0;

  // rect?: Rect;
  // coverSize?: Size;

  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;

  constructor(trackJson: {
    page: number,
    page_link: string,
    album: string,
    album_link: string,
    artist?: string,
    artist_link?: string,
    title?: string,
    track_link?: string,
    page_title?: string,
    long_artist?: string[],
  }) {
    this.page = trackJson.page;
    this.title = trackJson.title;
    this.trackLink = trackJson.track_link;
    this.pageLink = trackJson.page_link;
    this.album = trackJson.album;
    this.albumLink = trackJson.album_link;
    this.artist = trackJson.artist;
    this.artistLink = trackJson.artist_link;
    this.pageTitle = trackJson.page_title;
    this.longArtist = trackJson.long_artist || [];

    this.coverLink = `assets/covers/${cover_filename(this.title)}`;
  }

  getAbsolutePageLink() {
    return `https://www.homestuck.com${this.pageLink}`;
  }
}

function cover_filename(title: string) {
  if (title) {
    const fn = title.toLowerCase().replace(/ /g, '_').replace(/[^\w-]/g, '');
    const final = `cover_${fn}.jpg`;
    return final;
  }
  // TODO: return some generic cover page
  // also learn when one isn't there and replace that also
  return undefined;
}
